import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../api/mockData";
import { useAuth } from "../context/AuthContext";
import { categoryMascot } from "../api/categoryImages";
import AppShowcase from "../components/AppShowcase";

const STEPS = [
  {
    icon: "📋",
    title: "Tell us what you need",
    text: "Pick a service category and describe the job — takes less than a minute.",
  },
  {
    icon: "🧰",
    title: "A worker gets to it fast",
    text: "Nearby verified workers see your request and confirm availability.",
  },
  {
    icon: "✅",
    title: "Job done, pay after",
    text: "Track progress in real time and pay once the work is complete.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ahmed S.",
    rating: 5,
    quote: "The electrician who came was professional, on time, and fixed the wiring quickly. Would book again.",
  },
  {
    name: "Sana K.",
    rating: 4,
    quote: "Good work overall — the plumber was polite and explained everything before starting.",
  },
  {
    name: "Usman R.",
    rating: 5,
    quote: "Fixed a bad leak same day at a fair price. FixKar made it so easy to find someone nearby.",
  },
  {
    name: "Mehwish A.",
    rating: 5,
    quote: "Booked a painter in minutes and the whole job was done cleanly and on schedule.",
  },
];

const STATS = [
  { value: "1.2K+", label: "Jobs completed" },
  { value: "300+", label: "Verified workers" },
  { value: "7", label: "Service categories" },
  { value: "4.6★", label: "Average rating" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [quoteCategory, setQuoteCategory] = useState("");
  const [quoteArea, setQuoteArea] = useState("");

  // A logged-in user with a role already set has no business seeing the
  // marketing landing page or the "join as" cards — send them straight to
  // their real dashboard so login always lands somewhere useful.
  if (!loading && user?.role) {
    return (
      <Navigate to={user.role === "worker" ? "/worker/dashboard" : "/customer/dashboard"} replace />
    );
  }

  const goToWorkers = (category, searchTerm) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (searchTerm) params.set("search", searchTerm);
    navigate(`/workers${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") goToWorkers(activeCategory, search);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    goToWorkers(quoteCategory, quoteArea);
  };

  const visibleCategories =
    activeCategory === "All" ? CATEGORIES : CATEGORIES.filter((c) => c === activeCategory);

  return (
    <div className="page">
      {/* ---------- Hero ---------- */}
      <section className="hero-v2">
        <div className="hero-v2-inner container">
          <div className="hero-v2-copy">
            <span className="promo-badge">24/7 Support</span>
            <h1>Full range of home repair services</h1>
            <p className="muted hero-v2-sub">
              FixKar connects you with trusted electricians, plumbers, carpenters, AC
              technicians and more across Pakistan. Book in minutes, pay after the job.
            </p>

            <form className="hero-v2-quote-form" onSubmit={handleQuoteSubmit}>
              <select value={quoteCategory} onChange={(e) => setQuoteCategory(e.target.value)}>
                <option value="">Select service…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                placeholder="Your area / city"
                value={quoteArea}
                onChange={(e) => setQuoteArea(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Find a Worker
              </button>
            </form>
          </div>

          <div className="hero-v2-art">
            <img src="/images/hero-worker.svg" alt="FixKar worker" />
          </div>
        </div>

        <div className="hero-v2-stats container">
          {STATS.map((s) => (
            <div key={s.label} className="hero-v2-stat">
              <div className="hero-v2-stat-value">{s.value}</div>
              <div className="hero-v2-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Search + category showcase ---------- */}
      <div className="container" style={{ paddingTop: "2.5rem" }}>
        <div className="home-search">
          <input
            placeholder="Find your needed service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

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

        <div className="section-title">
          <h2>Browse by service</h2>
          <p className="muted">Tap a category to see available workers near you.</p>
        </div>
        <div className="category-showcase-grid">
          {visibleCategories.map((cat) => (
            <div key={cat} className="category-showcase-card" onClick={() => goToWorkers(cat)}>
              <img src={categoryMascot(cat)} alt="" className="category-showcase-mascot" />
              <div className="category-showcase-name">{cat}</div>
              <div className="muted category-showcase-cta">Book now →</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- App showcase (3-phone mockup) ---------- */}
      <AppShowcase />

      {/* ---------- How it works ---------- */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-title center">
            <h2>How FixKar Works</h2>
            <p className="muted">From request to finished job in three simple steps.</p>
          </div>
          <div className="how-it-works-grid">
            {STEPS.map((s, i) => (
              <div key={s.title} className="how-it-works-card">
                <div className="how-it-works-num">{i + 1}</div>
                <div className="how-it-works-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials (dark) ---------- */}
      <section className="testimonials-v2">
        <div className="container">
          <div className="section-title center">
            <h2 style={{ color: "#fff" }}>What people say about our services</h2>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              Real feedback from customers who booked through FixKar.
            </p>
          </div>
          <div className="testimonials-v2-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-v2-card">
                <div className="rating" style={{ marginBottom: "0.6rem" }}>
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
                <p className="testimonial-v2-quote">{t.quote}</p>
                <div className="testimonial-v2-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Role cards ---------- */}
      <div className="container" style={{ paddingBottom: "3rem" }}>
        <div className="role-grid mt-2" style={{ margin: "3rem auto 1rem" }}>
          <div className="card role-card" onClick={() => navigate("/register")}>
            <img src="/mascots/customer.svg" alt="" />
            <h3>I need a service</h3>
            <p className="muted">Sign up as a customer to find and book trusted workers.</p>
            <span className="btn btn-primary btn-sm mt-1">Join as a Customer</span>
          </div>
          <div className="card role-card" onClick={() => navigate("/register/worker")}>
            <img src="/mascots/worker.svg" alt="" />
            <h3>I offer a service</h3>
            <p className="muted">Sign up as a worker to receive bookings and grow your rating.</p>
            <span className="btn btn-primary btn-sm mt-1">Join as a Worker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
