import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";

const FILTERS = [
  { key: "pending", label: "New Requests" },
  { key: "accepted", label: "Accepted" },
  { key: "started", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "all", label: "All" },
];

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actingId, setActingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingService.list();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id, action) => {
    setActingId(id);
    setActionError("");
    try {
      await action(id);
      await load();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Action failed. Try again.");
    } finally {
      setActingId(null);
    }
  };

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="page container">
      <div className="name-row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <h2>Hi, {user?.full_name?.split(" ")[0] || "there"} 👋</h2>
        <Link to="/worker/payment-method" className="btn btn-outline btn-sm">
          Payout Method
        </Link>
      </div>
      <p className="muted mt-1" style={{ marginBottom: "1.5rem" }}>
        Manage your incoming and active jobs.
      </p>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`btn btn-sm ${filter === f.key ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {actionError && <div className="form-error">{actionError}</div>}

      {loading ? (
        <div className="empty-state">Loading your bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">Nothing here right now.</div>
      ) : (
        <div className="booking-list mt-1">
          {filtered.map((b) => (
            <div key={b.id} className="booking-row">
              <BookingCard booking={b} viewerRole="worker" />
              {b.status === "pending" && (
                <div className="booking-row-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={actingId === b.id}
                    onClick={(e) => {
                      e.preventDefault();
                      act(b.id, bookingService.accept);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={actingId === b.id}
                    onClick={(e) => {
                      e.preventDefault();
                      act(b.id, bookingService.reject);
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
              {b.status === "accepted" && (
                <div className="booking-row-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={actingId === b.id}
                    onClick={(e) => {
                      e.preventDefault();
                      act(b.id, bookingService.start);
                    }}
                  >
                    Start Job
                  </button>
                </div>
              )}
              {b.status === "started" && (
                <div className="booking-row-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={actingId === b.id}
                    onClick={(e) => {
                      e.preventDefault();
                      act(b.id, bookingService.complete);
                    }}
                  >
                    Mark Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
