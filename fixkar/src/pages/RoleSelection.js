import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Fallback page for the rare account that reaches the app with no role set
// (e.g. an older account from before signup collected role directly). Every
// current signup flow (CustomerRegister / WorkerRegister) sets role at
// registration, so most users should never see this page — if a user with a
// role already set lands here (stale link, back button, etc.), send them
// straight to their real dashboard instead of rendering the picker.
export default function RoleSelection() {
  const { user, selectRole } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (user?.role) {
    const home = user.role === "worker" ? "/worker/dashboard" : "/customer/dashboard";
    return <Navigate to={home} replace />;
  }

  const choose = async (role) => {
    setSubmitting(true);
    setError("");
    try {
      await selectRole(role);
      if (role === "worker") {
        navigate("/worker/profile-setup", { replace: true });
      } else {
        navigate("/customer/dashboard", { replace: true });
      }
    } catch (err) {
      setError("Could not set role. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="page container">
      <div className="center" style={{ marginTop: "2rem" }}>
        <img src="/app-logo.png" alt="FixKar" style={{ width: 64, height: 64 }} />
      </div>
      <h2 className="center mt-1">How will you use FixKar?</h2>
      <p className="muted center">You can only choose once, so pick the one that fits.</p>

      {error && (
        <div className="form-error" style={{ maxWidth: 420, margin: "1rem auto" }}>
          {error}
        </div>
      )}

      <div className="role-grid">
        <div
          className="card role-card"
          onClick={() => !submitting && choose("customer")}
        >
          <img src="/mascots/customer.svg" alt="" />
          <h3>I'm a Customer</h3>
          <p className="muted">I want to find and book home services.</p>
        </div>

        <div
          className="card role-card"
          onClick={() => !submitting && choose("worker")}
        >
          <img src="/mascots/worker.svg" alt="" />
          <h3>I'm a Worker</h3>
          <p className="muted">I provide services and want to receive bookings.</p>
        </div>
      </div>
    </div>
  );
}
