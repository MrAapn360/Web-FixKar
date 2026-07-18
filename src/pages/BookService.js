import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { workerService, bookingService } from "../api/services";

export default function BookService() {
  const { workerId } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    description: "",
    address: "",
    city: "",
    scheduled_at: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    workerService
      .get(workerId)
      .then((w) => {
        if (!active) return;
        setWorker(w);
        setForm((f) => ({ ...f, city: w.city || "" }));
      })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [workerId]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.address.trim()) {
      return setError("Please provide an address for the job.");
    }
    setSubmitting(true);
    try {
      const booking = await bookingService.create({
        worker_id: Number(workerId),
        category: worker.category,
        description: form.description || null,
        address: form.address,
        city: form.city || null,
        scheduled_at: form.scheduled_at || null,
        estimated_cost: worker.hourly_rate || null,
      });
      navigate(`/customer/bookings/${booking.id}`, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Could not create booking. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;

  if (notFound || !worker) {
    return (
      <div className="page container">
        <div className="card" style={{ maxWidth: 480, margin: "3rem auto", textAlign: "center" }}>
          <h2>Worker not found</h2>
          <Link to="/workers" className="btn btn-outline btn-sm mt-2">
            ← Back to workers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <Link to={`/workers/${workerId}`} className="muted" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Back to profile
      </Link>

      <div className="card form-card">
        <h2 className="center">Book {worker.full_name}</h2>
        <p className="muted center mt-1" style={{ marginBottom: "1.5rem" }}>
          {worker.category} · Rs {worker.hourly_rate}/hr
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>What do you need done?</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={update("description")}
              placeholder="Briefly describe the job…"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              value={form.address}
              onChange={update("address")}
              placeholder="House / street / area"
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input value={form.city} onChange={update("city")} placeholder="City" />
          </div>
          <div className="form-group">
            <label>Preferred date &amp; time (optional)</label>
            <input type="datetime-local" value={form.scheduled_at} onChange={update("scheduled_at")} />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Sending request…" : "Send Booking Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
