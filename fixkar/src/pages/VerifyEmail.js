import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Shown right after signup (real-backend mode) until the user enters the
// 6-digit code emailed to them. Mock mode never routes here since accounts
// are auto-verified at signup — see mockApi.register().
export default function VerifyEmail() {
  const { user, verifyEmail, resendVerificationCode, logout } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResendMessage("");
    if (code.trim().length !== 6) {
      return setError("Enter the 6-digit code from your email.");
    }
    setSubmitting(true);
    try {
      const updated = await verifyEmail(code.trim());
      const home = updated.role === "worker" ? "/worker/dashboard" : "/customer/dashboard";
      navigate(home, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");
    setResending(true);
    try {
      await resendVerificationCode();
      setResendMessage("A new code has been sent to your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="page container">
      <div className="card form-card">
        <div className="center">
          <img src="/app-logo.png" alt="FixKar" style={{ width: 56, height: 56 }} />
        </div>
        <h2 className="center mt-1">Verify your email</h2>
        <p className="muted center mt-1" style={{ marginBottom: "1.5rem" }}>
          We sent a 6-digit code to <strong>{user?.email}</strong>. Enter it below to
          activate your account.
        </p>

        {error && <div className="form-error">{error}</div>}
        {resendMessage && (
          <div className="form-success" style={{ marginBottom: "1rem" }}>
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Verification code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              style={{ letterSpacing: "0.4em", textAlign: "center", fontSize: "1.2rem" }}
              autoFocus
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Verifying…" : "Verify Email"}
          </button>
        </form>

        <p className="form-footer">
          Didn't get a code?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>
        <p className="muted center mt-1" style={{ fontSize: "0.85rem" }}>
          Wrong account?{" "}
          <button type="button" className="link-btn" onClick={() => logout()}>
            Log out
          </button>
        </p>
      </div>
    </div>
  );
}
