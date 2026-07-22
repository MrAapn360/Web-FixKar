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

// Pastel card-fill + status-text color per status, matching the reference
// screenshot's solid-tint card treatment (not just a left accent bar).
export const STATUS_FILL_CLASS = {
  pending: "booking-card-v3-pending",
  accepted: "booking-card-v3-active",
  started: "booking-card-v3-active",
  completed: "booking-card-v3-done",
  rejected: "booking-card-v3-rejected",
  cancelled: "booking-card-v3-rejected",
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
  const fillClass = STATUS_FILL_CLASS[booking.status] || "";

  return (
    <Link to={detailPath} className={`booking-card-v3 ${fillClass}`}>
      <div className="booking-card-v3-icon">
        {icon ? <img src={icon} alt="" /> : <span>{(booking.category || "?")[0]}</span>}
      </div>

      <div className="booking-card-v3-body">
        <div className="booking-card-v3-title">{booking.category}</div>
        <div className="booking-card-v3-meta">
          {otherPartyLabel}: {otherPartyName || "—"}
        </div>
        {booking.address && <div className="booking-card-v3-meta">{booking.address}</div>}
        {booking.scheduled_at && (
          <div className="booking-card-v3-meta">
            Scheduled: {new Date(booking.scheduled_at).toLocaleString()}
          </div>
        )}
      </div>

      <div className="booking-card-v3-status">
        {STATUS_LABEL[booking.status] || booking.status}
      </div>
    </Link>
  );
}
