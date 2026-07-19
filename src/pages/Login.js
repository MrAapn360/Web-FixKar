import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectAfterLogin = (user) => {
    if (!user.role) return navigate("/role-selection", { replace: true });
    const from = location.state?.from?.pathname;
    if (from) return navigate(from, { replace: true });
    navigate(user.role === "worker" ? "/worker/dashboard" : "/customer/dashboard", {
      replace: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      redirectAfterLogin(user);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page container">
      <div className="card form-card">
        <div className="center">
          <img src="/app-icon.svg" alt="FixKar" style={{ width: 56, height: 56 }} />
        </div>
        <h2 className="center mt-1">Welcome back</h2>
        <p className="muted center mt-1" style={{ marginBottom: "1.5rem" }}>
          Log in to your FixKar account
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="form-footer">
          No account? <Link to="/register">Sign up as a customer</Link> or{" "}
          <Link to="/register/worker">as a worker</Link>
        </p>
        <p className="muted center mt-2" style={{ fontSize: "0.8rem" }}>
          Demo: customer@fixkar.test / worker@fixkar.test — password: <b>password</b>
        </p>
      </div>
    </div>
  );
}
