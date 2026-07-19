import { useState } from "react";
import { bookingService } from "../api/services";

export default function PaymentForm({ bookingId, defaultAmount, onSubmitted }) {
  const [method, setMethod] = useState("cash");
  const [amount, setAmount] = useState(defaultAmount || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await bookingService.pay(bookingId, {
        method,
        amount: amount ? Number(amount) : undefined,
      });
      onSubmitted?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not record payment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mt-2">
      <h3>Pay for this job</h3>
      <p className="muted mt-1" style={{ marginBottom: "1rem" }}>
        This is a dummy payment for demo purposes — no real money moves.
      </p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Payment method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="easypaisa">EasyPaisa</option>
          </select>
        </div>
        <div className="form-group">
          <label>Amount (Rs)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount paid"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Recording payment…" : "Confirm Payment"}
        </button>
      </form>
    </div>
  );
}
