import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../api/services";
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
    <div className="page container">
      <h2>My Profile</h2>

      <div className="card mt-2" style={{ maxWidth: 520 }}>
        <div className="name-row" style={{ gap: "1.25rem" }}>
          {user?.photo_url || user?.photo_path ? (
            <img
              src={user.photo_url || user.photo_path}
              alt="Profile"
              className="avatar avatar-lg"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="avatar avatar-lg">{initials}</div>
          )}
          <div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
            {photoError && <div className="form-error mt-1">{photoError}</div>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-2">
          {error && <div className="form-error">{error}</div>}
          {saved && (
            <div className="mt-1" style={{ color: "var(--primary)", marginBottom: "1rem", fontSize: "0.9rem" }}>
              ✓ Saved.
            </div>
          )}

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

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card mt-2" style={{ maxWidth: 520, borderColor: "var(--danger)" }}>
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
  );
}
