import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, CITIES } from "../api/mockData";

export default function WorkerRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [account, setAccount] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [profile, setProfile] = useState({
    category: "",
    city: "",
    service_area: "",
    bio: "",
    skills: "",
    experience_years: "",
    hourly_rate: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateAccount = (k) => (e) => setAccount({ ...account, [k]: e.target.value });
  const updateProfile = (k) => (e) => setProfile({ ...profile, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (account.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (account.password !== account.confirm) {
      return setError("Passwords do not match.");
    }
    if (!profile.category) {
      return setError("Please choose the service you offer.");
    }

    setSubmitting(true);
    try {
      await register(account.full_name, account.email, account.password, {
        role: "worker",
        worker_profile: {
          category: profile.category,
          city: profile.city || null,
          service_area: profile.service_area || null,
          bio: profile.bio || null,
          skills: profile.skills
            ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          experience_years: profile.experience_years ? Number(profile.experience_years) : null,
          hourly_rate: profile.hourly_rate ? Number(profile.hourly_rate) : null,
        },
      });
      // Role + service profile are both set at signup — go straight to the
      // worker dashboard, no separate profile-setup step needed.
      navigate("/worker/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page container">
      <div className="card form-card" style={{ maxWidth: 520 }}>
        <div className="center">
          <img src="/mascots/worker.svg" alt="" style={{ width: 72, height: "auto" }} />
        </div>
        <h2 className="center mt-1">Sign up as a Worker</h2>
        <p className="muted center mt-1" style={{ marginBottom: "1.5rem" }}>
          Create your profile, receive booking requests, and grow your rating.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <h3>Account</h3>
          <div className="form-group">
            <label>Full name</label>
            <input value={account.full_name} onChange={updateAccount("full_name")} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={account.email} onChange={updateAccount("email")} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={account.password}
              onChange={updateAccount("password")}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              value={account.confirm}
              onChange={updateAccount("confirm")}
              required
            />
          </div>

          <h3 className="mt-2">Service details</h3>
          <div className="form-group">
            <label>What service do you offer?</label>
            <select value={profile.category} onChange={updateProfile("category")} required>
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>City</label>
            <select value={profile.city} onChange={updateProfile("city")}>
              <option value="">Select a city…</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Service area</label>
            <input
              value={profile.service_area}
              onChange={updateProfile("service_area")}
              placeholder="e.g. Gulshan-e-Iqbal"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={updateProfile("bio")}
              placeholder="Tell customers about your experience…"
            />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              value={profile.skills}
              onChange={updateProfile("skills")}
              placeholder="Wiring, Fan installation, Circuit repair"
            />
          </div>
          <div className="form-group">
            <label>Years of experience</label>
            <input
              type="number"
              min="0"
              value={profile.experience_years}
              onChange={updateProfile("experience_years")}
            />
          </div>
          <div className="form-group">
            <label>Hourly rate (Rs)</label>
            <input
              type="number"
              min="0"
              value={profile.hourly_rate}
              onChange={updateProfile("hourly_rate")}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating…" : "Sign Up as Worker"}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="muted center mt-1" style={{ fontSize: "0.85rem" }}>
          Looking for services instead? <Link to="/register">Sign up as a customer</Link>
        </p>
      </div>
    </div>
  );
}
