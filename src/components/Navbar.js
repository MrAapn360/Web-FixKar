import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardLink =
    user?.role === "worker" ? "/worker/dashboard" : "/customer/dashboard";

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
              <Link to="/notifications">Notifications</Link>
              <span className="navbar-user">Hi, {user.full_name.split(" ")[0]}</span>
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
