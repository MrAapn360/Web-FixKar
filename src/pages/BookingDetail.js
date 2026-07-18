import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { bookingService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { STATUS_LABEL, STATUS_CLASS } from "../components/BookingCard";
import ReviewForm from "../components/ReviewForm";
import PaymentForm from "../components/PaymentForm";

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.get(id);
      setBooking(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isWorker = user?.role === "worker";
  const backPath = isWorker ? "/worker/dashboard" : "/customer/dashboard";

  const runAction = async (action) => {
    setActing(true);
    setError("");
    try {
      await action(id);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || "Action failed. Try again.");
    } finally {
      setActing(false);
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;

  if (notFound || !booking) {
    return (
      <div className="page container">
        <div className="card" style={{ maxWidth: 480, margin: "3rem auto", textAlign: "center" }}>
          <h2>Booking not found</h2>
          <Link to={backPath} className="btn btn-outline btn-sm mt-2">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <Link to={backPath} className="muted" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Back to dashboard
      </Link>

      <div className="card">
        <div className="name-row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>{booking.category}</h2>
          <span className={`badge ${STATUS_CLASS[booking.status] || ""}`}>
            {STATUS_LABEL[booking.status] || booking.status}
          </span>
        </div>

        <div className="mt-2 booking-detail-grid">
          <div>
            <div className="muted">Customer</div>
            <div>{booking.customer_name || "—"}</div>
          </div>
          <div>
            <div className="muted">Worker</div>
            <div>{booking.worker_name || "—"}</div>
          </div>
          <div>
            <div className="muted">Address</div>
            <div>{booking.address || "—"}</div>
          </div>
          <div>
            <div className="muted">City</div>
            <div>{booking.city || "—"}</div>
          </div>
          <div>
            <div className="muted">Scheduled</div>
            <div>
              {booking.scheduled_at
                ? new Date(booking.scheduled_at).toLocaleString()
                : "Not specified"}
            </div>
          </div>
          <div>
            <div className="muted">Estimated cost</div>
            <div>{booking.estimated_cost ? `Rs ${booking.estimated_cost}` : "—"}</div>
          </div>
          {booking.final_cost != null && (
            <div>
              <div className="muted">Final cost</div>
              <div>Rs {booking.final_cost}</div>
            </div>
          )}
        </div>

        {booking.description && (
          <div className="mt-2">
            <div className="muted">Job description</div>
            <p style={{ margin: "0.35rem 0 0" }}>{booking.description}</p>
          </div>
        )}

        {error && <div className="form-error mt-2">{error}</div>}

        {/* ---- Worker actions ---- */}
        {isWorker && booking.status === "pending" && (
          <div className="mt-2" style={{ display: "flex", gap: "0.6rem" }}>
            <button
              className="btn btn-primary"
              disabled={acting}
              onClick={() => runAction(bookingService.accept)}
            >
              Accept
            </button>
            <button
              className="btn btn-outline"
              disabled={acting}
              onClick={() => runAction(bookingService.reject)}
            >
              Reject
            </button>
          </div>
        )}
        {isWorker && booking.status === "accepted" && (
          <button
            className="btn btn-primary mt-2"
            disabled={acting}
            onClick={() => runAction(bookingService.start)}
          >
            Start Job
          </button>
        )}
        {isWorker && booking.status === "started" && (
          <button
            className="btn btn-primary mt-2"
            disabled={acting}
            onClick={() => runAction(bookingService.complete)}
          >
            Mark Complete
          </button>
        )}

        {/* ---- Customer actions ---- */}
        {!isWorker && ["pending", "accepted"].includes(booking.status) && (
          <button
            className="btn btn-outline mt-2"
            disabled={acting}
            onClick={() => runAction(bookingService.cancel)}
          >
            Cancel Booking
          </button>
        )}
      </div>

      {/* ---- Payment (customer, completed booking) ---- */}
      {!isWorker && booking.status === "completed" && !booking.is_paid && (
        <PaymentForm
          bookingId={id}
          defaultAmount={booking.final_cost || booking.estimated_cost}
          onSubmitted={load}
        />
      )}
      {booking.status === "completed" && booking.is_paid && (
        <div className="card mt-2">
          <p className="muted" style={{ margin: 0 }}>
            ✓ Paid — Rs {booking.final_cost}
          </p>
        </div>
      )}

      {/* ---- Review (customer, completed booking) ---- */}
      {!isWorker && booking.status === "completed" && !booking.is_reviewed && (
        <ReviewForm bookingId={id} onSubmitted={load} />
      )}
      {!isWorker && booking.status === "completed" && booking.is_reviewed && (
        <div className="card mt-2">
          <p className="muted" style={{ margin: 0 }}>
            ✓ You've reviewed this booking. Thanks for the feedback!
          </p>
        </div>
      )}
    </div>
  );
}
