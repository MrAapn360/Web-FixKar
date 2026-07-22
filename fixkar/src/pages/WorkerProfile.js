import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { workerService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { categoryIcon } from "../api/categoryImages";

function StarRow({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="rating">
      {"★".repeat(full)}
      {"☆".repeat(5 - full)} <span className="muted">{rating.toFixed(1)}</span>
    </span>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="card review-card">
      <div className="name-row" style={{ justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700 }}>{review.customer_name}</div>
        <span className="rating">{"★".repeat(review.rating)}</span>
      </div>
      <p className="mt-1" style={{ margin: "0.5rem 0" }}>
        {review.comment}
      </p>
      {review.tags?.length > 0 && (
        <div className="skills">
          {review.tags.map((t) => (
            <span key={t} className="skill-tag">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="muted mt-1">{review.created_at}</div>
    </div>
  );
}

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    Promise.all([workerService.get(id), workerService.reviews(id)])
      .then(([w, r]) => {
        if (!active) return;
        setWorker(w);
        setReviews(r);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/workers/${id}` } } });
      return;
    }
    if (user.role !== "customer") {
      navigate(user.role === "worker" ? "/worker/dashboard" : "/role-selection");
      return;
    }
    navigate(`/customer/book/${id}`);
  };

  if (loading) {
    return <div className="page-loading">Loading worker profile…</div>;
  }

  if (notFound || !worker) {
    return (
      <div className="page container">
        <div className="card" style={{ maxWidth: 480, margin: "3rem auto", textAlign: "center" }}>
          <h2>Worker not found</h2>
          <p className="muted mt-1">This worker profile doesn't exist or was removed.</p>
          <Link to="/workers" className="btn btn-outline btn-sm mt-2">
            ← Back to workers
          </Link>
        </div>
      </div>
    );
  }

  const initials = worker.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const icon = categoryIcon(worker.category);

  return (
    <div className="page">
      <div className="worker-profile-v2-wrap">
        <Link to="/workers" className="muted mt-1" style={{ display: "inline-block", marginBottom: "1rem" }}>
          ← Back to workers
        </Link>

        <div className="card worker-profile-v2-header">
          <div className="worker-profile-v2-top">
            <div className="worker-profile-v2-avatar-frame">
              {worker.photo_url || worker.photo_path ? (
                <img
                  src={worker.photo_url || worker.photo_path}
                  alt={worker.full_name}
                  className="worker-profile-v2-photo"
                />
              ) : (
                <div className="worker-profile-v2-initials">{initials}</div>
              )}
              {icon && (
                <img src={icon} alt="" className="worker-profile-v2-service-badge" title={worker.category} />
              )}
            </div>

            <h2 className="mt-1" style={{ margin: "0.75rem 0 0.25rem" }}>{worker.full_name}</h2>

            <div className="worker-profile-v2-badges">
              {worker.is_verified && <span className="badge badge-verified">✓ Verified</span>}
              <span className="badge">{worker.is_available ? "Available" : "Busy"}</span>
            </div>

            <div className="muted mt-1">
              {worker.category} · {worker.service_area}, {worker.city}
            </div>
            <div className="mt-1">
              <StarRow rating={worker.average_rating} />
              <span className="muted"> ({worker.total_reviews} reviews)</span>
            </div>
          </div>

          <div className="worker-stats mt-2">
            <div className="stat-box">
              <div className="stat-value">{worker.experience_years}</div>
              <div className="muted">Years exp.</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{worker.total_jobs_done}</div>
              <div className="muted">Jobs done</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">Rs {worker.hourly_rate}</div>
              <div className="muted">Per hour</div>
            </div>
          </div>

          <button className="btn btn-primary btn-block mt-2" onClick={handleBookNow}>
            Book Now
          </button>
        </div>

        <div className="card mt-2">
          <h3>About</h3>
          <p className="muted" style={{ lineHeight: 1.6 }}>{worker.bio}</p>
        </div>

        <div className="card mt-2">
          <h3>Skills</h3>
          <div className="skills mt-1">
            {(worker.skills || []).map((s) => (
              <span key={s} className="skill-tag">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <h3>Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div className="empty-state">No reviews yet.</div>
          ) : (
            <div className="review-list mt-1">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
