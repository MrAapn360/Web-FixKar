import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout, unreadCount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardLink =
    user?.role === "worker" ? "/worker/dashboard" : "/customer/dashboard";
  const profileLink =
    user?.role === "worker" ? "/worker/profile" : "/customer/profile";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Fix<span>Kar</span>
        </Link>

        <div className="navbar-links">
          <Link to="/workers">Find a Worker</Link>

          {isAuthenticated ? (
            <>
              {user.role && <Link to={dashboardLink}>Dashboard</Link>}
              <Link to="/notifications" style={{ position: "relative" }}>
                Notifications
                {unreadCount > 0 && (
                  <span
                    style={{
                      marginLeft: "0.35rem",
                      background: "var(--danger)",
                      color: "#fff",
                      borderRadius: "999px",
                      padding: "0.05rem 0.45rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              {user.role && (
                <Link to={profileLink} className="navbar-user" style={{ textDecoration: "underline" }}>
                  Hi, {user.full_name.split(" ")[0]}
                </Link>
              )}
              {!user.role && (
                <span className="navbar-user">Hi, {user.full_name.split(" ")[0]}</span>
              )}
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
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
