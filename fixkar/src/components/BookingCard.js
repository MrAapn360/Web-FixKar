import { Link } from "react-router-dom";
import { categoryIcon } from "../api/categoryImages";

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
  const icon = categoryIcon(booking.category);

  return (
    <Link to={detailPath} className={`card booking-card-v2 ${STATUS_CLASS[booking.status] || ""}`}>
      <div className="booking-card-v2-icon">
        {icon ? <img src={icon} alt="" /> : <span>{(booking.category || "?")[0]}</span>}
      </div>

      <div className="booking-card-v2-body">
        <div className="booking-card-v2-top">
          <div className="booking-card-v2-title">{booking.category}</div>
          <span className={`badge ${STATUS_CLASS[booking.status] || ""}`}>
            {STATUS_LABEL[booking.status] || booking.status}
          </span>
        </div>
        <div className="muted booking-card-v2-meta">
          {otherPartyLabel}: {otherPartyName || "—"}
        </div>
        {booking.address && <div className="muted booking-card-v2-meta">{booking.address}</div>}
        {booking.scheduled_at && (
          <div className="muted booking-card-v2-meta">
            Scheduled: {new Date(booking.scheduled_at).toLocaleString()}
          </div>
        )}
      </div>
    </Link>
  );
}
