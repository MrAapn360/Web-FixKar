import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import BookingCard from "../components/BookingCard";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "started", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    active: bookings.filter((b) => b.status === "pending" || b.status === "accepted" || b.status === "started").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    total: bookings.length,
  };

  return (
    <div className="page">
      <div className="dash-v2-wrap">
        <div className="dash-v2-header">
          <div>
            <h2>Hi, {user?.full_name?.split(" ")[0] || "there"} 👋</h2>
            <p className="muted mt-1">Track the services you've booked.</p>
          </div>
          <Link to="/workers" className="btn btn-primary">
            + New Booking
          </Link>
        </div>

        <div className="dash-v2-stats">
          <div className="dash-v2-stat">
            <div className="dash-v2-stat-value">{counts.total}</div>
            <div className="muted">Total bookings</div>
          </div>
          <div className="dash-v2-stat">
            <div className="dash-v2-stat-value">{counts.active}</div>
            <div className="muted">Active</div>
          </div>
          <div className="dash-v2-stat">
            <div className="dash-v2-stat-value">{counts.completed}</div>
            <div className="muted">Completed</div>
          </div>
        </div>

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

        {loading ? (
          <div className="empty-state">Loading your bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            {bookings.length === 0
              ? "No bookings yet. Find a worker to get started."
              : "No bookings match this filter."}
          </div>
        ) : (
          <div className="booking-list mt-1">
            {filtered.map((b) => (
              <BookingCard key={b.id} booking={b} viewerRole="customer" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
