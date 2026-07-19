import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { profileService, workerService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { clearToken } from "../api/client";
import { CATEGORIES } from "../api/mockData";

export default function WorkerProfileSettings() {
  const { user, updateUser, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [baseForm, setBaseForm] = useState({
    full_name: user?.full_name || "",
    city: user?.city || "",
    phone: user?.phone || "",
  });
  const [workerForm, setWorkerForm] = useState({
    category: "",
    bio: "",
    skills: "",
    experience_years: "",
    hourly_rate: "",
    service_area: "",
    is_available: true,
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Prefill worker-specific fields from the existing profile, if any.
  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    workerService
      .get(user.id)
      .then((w) => {
        if (!active || !w) return;
        setWorkerForm({
          category: w.category || "",
          bio: w.bio || "",
          skills: (w.skills || []).join(", "),
          experience_years: w.experience_years ?? "",
          hourly_rate: w.hourly_rate ?? "",
          service_area: w.service_area || "",
          is_available: w.is_available ?? true,
        });
      })
      .catch(() => {
        // No profile yet — fine, this is first-time setup.
      })
      .finally(() => active && setLoadingProfile(false));
    return () => {
      active = false;
    };
  }, [user?.id]);

  const updateBase = (k) => (e) => {
    setSaved(false);
    setBaseForm({ ...baseForm, [k]: e.target.value });
  };
  const updateWorker = (k) => (e) => {
    setSaved(false);
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setWorkerForm({ ...workerForm, [k]: v });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!workerForm.category) {
      return setError("Please choose a service category.");
    }

    setSaving(true);
    try {
      const updatedUser = await profileService.update(baseForm);
      updateUser(updatedUser);

      await profileService.updateWorkerProfile({
        category: workerForm.category,
        bio: workerForm.bio || null,
        skills: workerForm.skills
          ? workerForm.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        experience_years: workerForm.experience_years
          ? Number(workerForm.experience_years)
          : null,
        hourly_rate: workerForm.hourly_rate ? Number(workerForm.hourly_rate) : null,
        service_area: workerForm.service_area || null,
        is_available: !!workerForm.is_available,
      });

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

  if (loadingProfile) return <div className="page-loading">Loading…</div>;

  return (
    <div className="page container">
      <h2>My Worker Profile</h2>

      <div className="card mt-2" style={{ maxWidth: 560 }}>
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

          <h3>Basic info</h3>
          <div className="form-group">
            <label>Full name</label>
            <input value={baseForm.full_name} onChange={updateBase("full_name")} required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input value={baseForm.city} onChange={updateBase("city")} placeholder="City" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={baseForm.phone} onChange={updateBase("phone")} placeholder="03XXXXXXXXX" />
          </div>

          <h3 className="mt-2">Service details</h3>
          <div className="form-group">
            <label>Category</label>
            <select value={workerForm.category} onChange={updateWorker("category")} required>
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea rows={3} value={workerForm.bio} onChange={updateWorker("bio")} placeholder="Tell customers about your experience…" />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              value={workerForm.skills}
              onChange={updateWorker("skills")}
              placeholder="Wiring, Fan installation, Circuit repair"
            />
          </div>
          <div className="form-group">
            <label>Years of experience</label>
            <input
              type="number"
              min="0"
              value={workerForm.experience_years}
              onChange={updateWorker("experience_years")}
            />
          </div>
          <div className="form-group">
            <label>Hourly rate (Rs)</label>
            <input
              type="number"
              min="0"
              value={workerForm.hourly_rate}
              onChange={updateWorker("hourly_rate")}
            />
          </div>
          <div className="form-group">
            <label>Service area</label>
            <input
              value={workerForm.service_area}
              onChange={updateWorker("service_area")}
              placeholder="e.g. Gulshan-e-Iqbal"
            />
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={!!workerForm.is_available}
                onChange={updateWorker("is_available")}
                style={{ width: "auto" }}
              />
              Available for new bookings
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card mt-2" style={{ maxWidth: 560, borderColor: "var(--danger)" }}>
        <h3 style={{ color: "var(--danger)" }}>Delete Account</h3>
        <p className="muted mt-1">
          This permanently removes your account and worker profile. Your booking, review, and
          payment history stays on record but is no longer linked to your name.
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
