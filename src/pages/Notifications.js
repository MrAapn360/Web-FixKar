import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { notificationService } from "../api/services";
import { useAuth } from "../context/AuthContext";

const timeAgo = (iso) => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const linkFor = (n, role) => {
  if (n.type === "booking" || n.type === "payment") {
    if (!n.related_id) return null;
    return role === "worker" ? `/worker/bookings/${n.related_id}` : `/customer/bookings/${n.related_id}`;
  }
  return null;
};

export default function Notifications() {
  const { user, refreshUnreadCount } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await notificationService.list();
      setItems(data);
      setError("");
    } catch (err) {
      setError("Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await notificationService.markRead(id);
      refreshUnreadCount();
    } catch (err) {
      // Non-critical — a stale badge will self-correct on next poll/refresh.
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await notificationService.markAllRead();
      refreshUnreadCount();
    } catch (err) {
      // Non-critical.
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <div className="page container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead} disabled={markingAll}>
            {markingAll ? "Marking…" : `Mark all as read (${unreadCount})`}
          </button>
        )}
      </div>

      {loading && <div className="page-loading">Loading…</div>}
      {!loading && error && <div className="form-error mt-2">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">You don't have any notifications yet.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="booking-list mt-2">
          {items.map((n) => {
            const to = linkFor(n, user?.role);
            const content = (
              <div
                className="card"
                style={{
                  borderColor: n.is_read ? "var(--border)" : "var(--primary)",
                  background: n.is_read ? "var(--card)" : "var(--primary-light)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                  <strong>{n.title}</strong>
                  <span className="muted" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {timeAgo(n.created_at)}
                  </span>
                </div>
                <p className="muted mt-1" style={{ marginBottom: 0 }}>
                  {n.body}
                </p>
              </div>
            );

            return (
              <div key={n.id} onClick={() => !n.is_read && handleMarkRead(n.id)} style={{ cursor: to || !n.is_read ? "pointer" : "default" }}>
                {to ? (
                  <Link to={to} className="booking-card" style={{ display: "block" }}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
