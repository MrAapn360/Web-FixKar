import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { paymentMethodService } from "../api/services";

export default function PaymentMethodSettings() {
  const [form, setForm] = useState({ easypaisa_number: "", account_title: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    paymentMethodService
      .get()
      .then((m) => {
        if (!active) return;
        setForm({
          easypaisa_number: m.easypaisa_number || "",
          account_title: m.account_title || "",
        });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const update = (k) => (e) => {
    setSaved(false);
    setForm({ ...form, [k]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await paymentMethodService.update(form);
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <div className="page container">
      <Link to="/worker/dashboard" className="muted" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Back to dashboard
      </Link>

      <div className="card form-card">
        <h2 className="center">Payout Method</h2>
        <p className="muted center mt-1" style={{ marginBottom: "1.5rem" }}>
          Where should customer payments be sent?
        </p>

        {error && <div className="form-error">{error}</div>}
        {saved && (
          <div className="mt-1" style={{ color: "var(--primary)", marginBottom: "1rem", fontSize: "0.9rem" }}>
            ✓ Saved.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>EasyPaisa number</label>
            <input
              value={form.easypaisa_number}
              onChange={update("easypaisa_number")}
              placeholder="03XXXXXXXXX"
            />
          </div>
          <div className="form-group">
            <label>Account title</label>
            <input
              value={form.account_title}
              onChange={update("account_title")}
              placeholder="Name on the account"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
