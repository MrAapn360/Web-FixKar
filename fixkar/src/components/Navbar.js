import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3a5.5 5.5 0 0 0-5.5 5.5v2.6c0 .5-.18.99-.5 1.38L4.6 14.2c-.6.7-.12 1.8.8 1.8h13.2c.92 0 1.4-1.1.8-1.8l-1.4-1.72a2.1 2.1 0 0 1-.5-1.38V8.5A5.5 5.5 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M20 20l-4.4-4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout, unreadCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardLink =
    user?.role === "worker" ? "/worker/dashboard" : "/customer/dashboard";
  const profileLink =
    user?.role === "worker" ? "/worker/profile" : "/customer/profile";

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-v2">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/app-logo.png" alt="" />
          Fix<span>Kar</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/workers"
            className={`navbar-pill-link ${isActive("/workers") ? "navbar-pill-link-active" : ""}`}
          >
            <SearchIcon />
            <span>Find a Worker</span>
          </Link>

          {isAuthenticated ? (
            <>
              {user.role && (
                <Link
                  to={dashboardLink}
                  className={`navbar-pill-link ${isActive(dashboardLink) ? "navbar-pill-link-active" : ""}`}
                >
                  <GridIcon />
                  <span>Dashboard</span>
                </Link>
              )}

              <Link to="/notifications" className="navbar-icon-btn" title="Notifications">
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="navbar-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </Link>

              {user.role && (
                <Link to={profileLink} className="navbar-user-chip">
                  {user.photo_url || user.photo_path ? (
                    <img src={user.photo_url || user.photo_path} alt="" className="navbar-avatar" />
                  ) : (
                    <span className="navbar-avatar navbar-avatar-fallback">
                      {user.full_name.split(" ")[0][0]}
                    </span>
                  )}
                  <span className="navbar-user-name">{user.full_name.split(" ")[0]}</span>
                </Link>
              )}
              {!user.role && (
                <span className="navbar-user">Hi, {user.full_name.split(" ")[0]}</span>
              )}

              <button className="navbar-icon-btn navbar-logout-btn" onClick={handleLogout} title="Logout">
                <LogoutIcon />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-pill-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
