import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { workerService } from "../api/services";
import { CATEGORIES, CITIES } from "../api/mockData";
import { categoryIcon } from "../api/categoryImages";

function WorkerCard({ worker, onClick }) {
  const initials = worker.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  const icon = categoryIcon(worker.category);

  return (
    <div className="card worker-card-v2" onClick={onClick}>
      <div className="worker-card-v2-top">
        <div className="worker-card-v2-avatar-frame">
          {worker.photo_url || worker.photo_path ? (
            <img
              src={worker.photo_url || worker.photo_path}
              alt={worker.full_name}
              className="worker-card-v2-photo"
            />
          ) : (
            <div className="worker-card-v2-initials">{initials}</div>
          )}
          {icon && (
            <img src={icon} alt="" className="worker-card-v2-service-badge" title={worker.category} />
          )}
          <span
            className={`worker-card-v2-status-dot ${worker.is_available ? "is-available" : "is-busy"}`}
            title={worker.is_available ? "Available" : "Busy"}
          />
        </div>

        <div className="worker-card-v2-info">
          <div className="worker-card-v2-name-row">
            <span className="worker-card-v2-name">{worker.full_name}</span>
            {worker.is_verified && <span className="badge badge-verified">✓ Verified</span>}
          </div>
          <div className="muted">{worker.category}</div>
          <div className="worker-card-v2-rating">
            <span className="rating">★ {(worker.average_rating ?? 0).toFixed(1)}</span>
            <span className="muted">({worker.total_reviews ?? 0})</span>
          </div>
        </div>
      </div>

      <div className="worker-card-v2-divider" />

      <div className="worker-card-v2-footer">
        <div className="muted">
          {[worker.service_area, worker.city].filter(Boolean).join(", ") || "Location not set"}
          {worker.experience_years != null ? ` · ${worker.experience_years} yrs exp` : ""}
        </div>
        <div className="worker-card-v2-rate">
          {worker.hourly_rate ? `Rs ${worker.hourly_rate}/hr` : "Rate not set"}
        </div>
      </div>
    </div>
  );
}

export default function Workers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";
  const search = searchParams.get("search") || "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await workerService.list({ category, city, search });
      setWorkers(data);
    } finally {
      setLoading(false);
    }
  }, [category, city, search]);

  useEffect(() => {
    load();
  }, [load]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="page container">
      <h2>Find a Worker</h2>

      <div className="filters">
        <input
          placeholder="Search name, skill, category…"
          defaultValue={search}
          onChange={(e) => setParam("search", e.target.value)}
        />
        <select value={category} onChange={(e) => setParam("category", e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={city} onChange={(e) => setParam("city", e.target.value)}>
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="empty-state">Loading workers…</div>
      ) : workers.length === 0 ? (
        <div className="empty-state">No workers match your filters.</div>
      ) : (
        <div className="worker-grid">
          {workers.map((w) => (
            <WorkerCard
              key={w.id}
              worker={w}
              onClick={() => navigate(`/workers/${w.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
