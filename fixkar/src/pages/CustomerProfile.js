import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { profileService, bookingService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { clearToken } from "../api/client";

export default function CustomerProfile() {
  const { user, updateUser, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    city: user?.city || "",
    phone: user?.phone || "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await bookingService.list();
      setBookings(data);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const stats = {
    total: bookings.length,
    done: bookings.filter((b) => b.status === "completed").length,
    ongoing: bookings.filter((b) => b.status === "pending" || b.status === "accepted" || b.status === "started").length,
    cancelled: bookings.filter((b) => b.status === "cancelled" || b.status === "rejected").length,
  };

  const update = (k) => (e) => {
    setSaved(false);
    setForm({ ...form, [k]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const updated = await profileService.update(form);
      updateUser(updated);
      setSaved(true);
      setEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    setUploading(true);
    try {
      const result = await profileService.uploadPhoto(file);
      updateUser({ photo_path: result.photo_path, photo_url: result.photo_url });
    } catch (err) {
      setPhotoError(err?.response?.data?.message || "Could not upload photo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleting(true);
    try {
      await profileService.deleteAccount();
      clearToken();
      setUser(null);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Could not delete account. Try again.");
      setDeleting(false);
    }
  };

  const initials = (user?.full_name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="page">
      <div className="profile-v2-wrap">
        <h2 className="center">My Profile</h2>

        {/* ---------- Avatar + name/email ---------- */}
        <div className="profile-v2-hero">
          <div className="profile-v2-avatar-frame">
            {user?.photo_url || user?.photo_path ? (
              <img
                src={user.photo_url || user.photo_path}
                alt="Profile"
                className="worker-profile-v2-photo"
              />
            ) : (
              <div className="worker-profile-v2-initials">{initials}</div>
            )}
            <button
              type="button"
              className="profile-v2-camera-btn"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              title="Change photo"
            >
              {uploading ? "…" : "📷"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>
          <h3 className="mt-1" style={{ margin: "0.75rem 0 0.15rem" }}>{user?.full_name}</h3>
          <p className="muted">{user?.email}</p>
          {photoError && <div className="form-error mt-1">{photoError}</div>}
        </div>

        {/* ---------- Booking summary ---------- */}
        <div className="card profile-v2-summary-card mt-2">
          <h3>Booking Summary</h3>
          <div className="profile-v2-summary-row">
            <div className="profile-v2-summary-stat">
              <div className="profile-v2-summary-value" style={{ color: "var(--primary)" }}>
                {statsLoading ? "–" : stats.total}
              </div>
              <div className="muted">Total</div>
            </div>
            <div className="profile-v2-summary-stat">
              <div className="profile-v2-summary-value" style={{ color: "#2fb872" }}>
                {statsLoading ? "–" : stats.done}
              </div>
              <div className="muted">Done</div>
            </div>
            <div className="profile-v2-summary-stat">
              <div className="profile-v2-summary-value" style={{ color: "#f0a83a" }}>
                {statsLoading ? "–" : stats.ongoing}
              </div>
              <div className="muted">Ongoing</div>
            </div>
            <div className="profile-v2-summary-stat">
              <div className="profile-v2-summary-value" style={{ color: "var(--danger)" }}>
                {statsLoading ? "–" : stats.cancelled}
              </div>
              <div className="muted">Cancelled</div>
            </div>
          </div>
        </div>

        {/* ---------- Account info ---------- */}
        <div className="profile-v2-section-label mt-2">
          <h3>Account Info</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing((e) => !e)}>
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {error && <div className="form-error mt-1">{error}</div>}
        {saved && !editing && (
          <div className="mt-1" style={{ color: "var(--primary)", fontSize: "0.9rem" }}>
            ✓ Saved.
          </div>
        )}

        {!editing ? (
          <div className="profile-v2-info-list mt-1">
            <div className="profile-v2-info-row">
              <span className="profile-v2-info-icon">👤</span>
              <div>
                <div className="muted">Full Name</div>
                <div className="profile-v2-info-value">{user?.full_name || "—"}</div>
              </div>
            </div>
            <div className="profile-v2-info-row">
              <span className="profile-v2-info-icon">✉️</span>
              <div>
                <div className="muted">Email</div>
                <div className="profile-v2-info-value">{user?.email || "—"}</div>
              </div>
            </div>
            <div className="profile-v2-info-row">
              <span className="profile-v2-info-icon">📞</span>
              <div>
                <div className="muted">Phone</div>
                <div className="profile-v2-info-value">{user?.phone || "Not set"}</div>
              </div>
            </div>
            <div className="profile-v2-info-row">
              <span className="profile-v2-info-icon">📍</span>
              <div>
                <div className="muted">City</div>
                <div className="profile-v2-info-value">{user?.city || "Not set"}</div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card profile-v2-card mt-1">
            <div className="form-group">
              <label>Full name</label>
              <input value={form.full_name} onChange={update("full_name")} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input value={form.city} onChange={update("city")} placeholder="City" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={update("phone")} placeholder="03XXXXXXXXX" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={user?.email || ""} disabled />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}

        {/* ---------- Preferences ---------- */}
        <div className="profile-v2-section-label mt-2">
          <h3>Preferences</h3>
        </div>
        <div className="profile-v2-info-list mt-1">
          <div className="profile-v2-info-row">
            <span className="profile-v2-info-icon">🔔</span>
            <div>
              <div className="muted">Notifications</div>
              <div className="profile-v2-info-value">Booking updates &amp; messages enabled</div>
            </div>
          </div>
        </div>

        {/* ---------- Delete account ---------- */}
        <div className="card profile-v2-card mt-2" style={{ borderColor: "var(--danger)" }}>
          <h3 style={{ color: "var(--danger)" }}>Delete Account</h3>
          <p className="muted mt-1">
            This permanently removes your account. Your booking, review, and payment history
            stays on record but is no longer linked to your name.
          </p>

          {deleteError && <div className="form-error mt-1">{deleteError}</div>}

          {!confirmingDelete ? (
            <button
              type="button"
              className="btn btn-outline mt-1"
              style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
              onClick={() => setConfirmingDelete(true)}
            >
              Delete my account
            </button>
          ) : (
            <div className="mt-1" style={{ display: "flex", gap: "0.6rem" }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: "var(--danger)" }}
                disabled={deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "Deleting…" : "Yes, delete permanently"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
