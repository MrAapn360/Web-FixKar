import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { workerService } from "../api/services";
import { CATEGORIES, CITIES } from "../api/mockData";

function WorkerCard({ worker, onClick }) {
  const initials = worker.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="card worker-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="name-row">
        <div className="avatar">{initials}</div>
        <div>
          <div style={{ fontWeight: 700 }}>{worker.full_name}</div>
          <div className="muted">{worker.category}</div>
        </div>
      </div>

      <div className="name-row" style={{ justifyContent: "space-between" }}>
        <span className="rating">★ {(worker.average_rating ?? 0).toFixed(1)}</span>
        <span className="muted">{worker.hourly_rate ? `Rs ${worker.hourly_rate}/hr` : "Rate not set"}</span>
      </div>

      <div className="muted">
        {[worker.service_area, worker.city].filter(Boolean).join(", ") || "Location not set"}
        {worker.experience_years != null ? ` · ${worker.experience_years} yrs` : ""}
      </div>

      <div style={{ display: "flex", gap: "0.4rem" }}>
        {worker.is_verified && <span className="badge badge-verified">✓ Verified</span>}
        <span className="badge">{worker.is_available ? "Available" : "Busy"}</span>
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
