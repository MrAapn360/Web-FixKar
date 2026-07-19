import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards routes that require auth (and optionally a specific role).
// - not logged in            -> /login
// - logged in but no role    -> /role-selection
// - wrong role for the page  -> that role's dashboard
export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loading">Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.role) {
    return <Navigate to="/role-selection" replace />;
  }

  if (role && user.role !== role) {
    const home = user.role === "worker" ? "/worker/dashboard" : "/customer/dashboard";
    return <Navigate to={home} replace />;
  }

  return children;
}
