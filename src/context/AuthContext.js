import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { authService, notificationService } from "../api/services";
import { setToken, clearToken, getToken } from "../api/client";

const AuthContext = createContext(null);
const POLL_INTERVAL_MS = 20000; // 20s, within the roadmap's 15-30s target

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session
  const [unreadCount, setUnreadCount] = useState(0);
  const pollRef = useRef(null);

  // On app load, if a token exists, fetch the current user.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user } = await authService.login({ email, password });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (full_name, email, password) => {
    const { token, user } = await authService.register({ full_name, email, password });
    setToken(token);
    setUser(user);
    return user;
  }, []);

  const selectRole = useCallback(async (role) => {
    const updated = await authService.selectRole(role);
    setUser(updated);
    return updated;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore network errors on logout
    }
    clearToken();
    setUser(null);
  }, []);

  // For after profile edits / photo upload — merges into the current user
  // without a round trip to /me.
  const updateUser = useCallback((patch) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const { count } = await notificationService.unreadCount();
      setUnreadCount(count);
    } catch (e) {
      // Non-critical — badge just won't update this cycle.
    }
  }, []);

  // Poll for unread notifications while logged in. Starts once a user is
  // present, stops (and resets the badge) on logout.
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    refreshUnreadCount();
    pollRef.current = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [user, refreshUnreadCount]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    selectRole,
    logout,
    setUser,
    updateUser,
    unreadCount,
    refreshUnreadCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
