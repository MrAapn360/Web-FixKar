import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (form.password !== form.confirm) {
      return setError("Passwords do not match.");
    }
    setSubmitting(true);
    try {
      await register(form.full_name, form.email, form.password);
      // New users have no role yet -> pick one.
      navigate("/role-selection", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page container">
      <div className="card form-card">
        <h2 className="center">Create your account</h2>
        <p className="muted center mt-1" style={{ marginBottom: "1.5rem" }}>
          Join FixKar as a customer or worker
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input value={form.full_name} onChange={update("full_name")} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update("email")} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={update("password")}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={update("confirm")}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating…" : "Sign Up"}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
