import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../api/mockData";

const PROMO = {
  Electrician: {
    bg: "linear-gradient(135deg, #dcE6ff 0%, #c6d6ff 100%)",
    trust: "Trusted Electrician Help",
    headline: "Expert Electricians You Can Trust",
    mascot: "/mascots/electrician.svg",
  },
  Plumber: {
    bg: "linear-gradient(135deg, #d3f7f2 0%, #baeee7 100%)",
    trust: "Trusted Plumber Help",
    headline: "Fast & Reliable Plumbing Service",
    mascot: "/mascots/plumber.svg",
  },
  Painter: {
    bg: "linear-gradient(135deg, #f3e3ff 0%, #e6cdff 100%)",
    trust: "Trusted Painter Help",
    headline: "Professional Interior & Exterior Painting",
    mascot: "/mascots/painter.svg",
  },
  Carpenter: {
    bg: "linear-gradient(135deg, #ffe9d3 0%, #ffd9b3 100%)",
    trust: "Trusted Carpenter Help",
    headline: "Custom Woodwork & Furniture Repair",
    mascot: "/mascots/carpenter.svg",
  },
  "AC Technician": {
    bg: "linear-gradient(135deg, #d3edff 0%, #b8e2ff 100%)",
    trust: "Trusted AC Technician Help",
    headline: "AC Installation & Cooling Repair",
    mascot: "/mascots/ac-technician.svg",
  },
  Mechanic: {
    bg: "linear-gradient(135deg, #e2e5ea 0%, #cfd4db 100%)",
    trust: "Trusted Mechanic Help",
    headline: "Home Car Service & Diagnostics",
    mascot: "/mascots/mechanic.svg",
  },
  Laborer: {
    bg: "linear-gradient(135deg, #ffe9cf 0%, #ffdba8 100%)",
    trust: "Trusted Laborer Help",
    headline: "Reliable Shifting & Loading Work",
    mascot: "/mascots/laborer.svg",
  },
};

export default function Landing() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const goToWorkers = (category, searchTerm) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (searchTerm) params.set("search", searchTerm);
    navigate(`/workers${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") goToWorkers(activeCategory, search);
  };

  const visibleCategories =
    activeCategory === "All" ? CATEGORIES : CATEGORIES.filter((c) => c === activeCategory);

  return (
    <div className="page">
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div className="home-search">
          <input
            placeholder="Find your needed service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        <section className="hero">
          <h1>Book Home Services in Minutes</h1>
          <p>
            FixKar connects you with trusted electricians, plumbers, carpenters, AC
            technicians and more across Pakistan. Book in minutes, pay after the job.
          </p>
          <button className="btn btn-primary" onClick={() => goToWorkers(activeCategory, search)}>
            Find a Worker
          </button>
        </section>

        <div className="category-chips">
          <button
            type="button"
            className={`category-chip ${activeCategory === "All" ? "category-chip-active" : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-chip ${activeCategory === cat ? "category-chip-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="promo-list">
          {visibleCategories.map((cat) => {
            const promo = PROMO[cat];
            if (!promo) return null;
            return (
              <div key={cat} className="promo-card" style={{ background: promo.bg }}>
                <div className="promo-card-content">
                  <span className="promo-badge">24/7 Support</span>
                  <div className="promo-trust">🛡️ {promo.trust}</div>
                  <h3>{promo.headline}</h3>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => goToWorkers(cat)}
                  >
                    Book Now
                  </button>
                </div>
                <img src={promo.mascot} alt={cat} />
              </div>
            );
          })}
        </div>

        <div className="center mt-2" style={{ margin: "3rem 0 1rem" }}>
          <h2>Are you a worker?</h2>
          <p className="muted">
            Create a profile, receive booking requests, and grow your rating.
          </p>
          <button className="btn btn-primary mt-1" onClick={() => navigate("/register")}>
            Join as a Worker
          </button>
        </div>
      </div>
    </div>
  );
}
