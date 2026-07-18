import { Link } from "react-router-dom";

// Maps booking status -> badge class + friendly label, shared by both dashboards.
export const STATUS_LABEL = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  started: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_CLASS = {
  pending: "badge-status-pending",
  accepted: "badge-status-accepted",
  rejected: "badge-status-rejected",
  started: "badge-status-started",
  completed: "badge-status-completed",
  cancelled: "badge-status-rejected",
};

export default function BookingCard({ booking, viewerRole }) {
  const detailPath =
    viewerRole === "worker"
      ? `/worker/bookings/${booking.id}`
      : `/customer/bookings/${booking.id}`;

  const otherPartyLabel = viewerRole === "worker" ? "Customer" : "Worker";
  const otherPartyName =
    viewerRole === "worker" ? booking.customer_name : booking.worker_name;

  return (
    <Link to={detailPath} className="card booking-card">
      <div className="name-row" style={{ justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700 }}>{booking.category}</div>
        <span className={`badge ${STATUS_CLASS[booking.status] || ""}`}>
          {STATUS_LABEL[booking.status] || booking.status}
        </span>
      </div>
      <div className="muted mt-1">
        {otherPartyLabel}: {otherPartyName || "—"}
      </div>
      {booking.address && <div className="muted">{booking.address}</div>}
      {booking.scheduled_at && (
        <div className="muted">
          Scheduled: {new Date(booking.scheduled_at).toLocaleString()}
        </div>
      )}
    </Link>
  );
}
