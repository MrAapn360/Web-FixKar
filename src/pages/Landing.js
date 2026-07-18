import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../api/mockData";

const EMOJI = {
  Electrician: "⚡",
  Plumber: "🔧",
  Carpenter: "🪚",
  "AC Technician": "❄️",
  Mechanic: "🔩",
  Painter: "🎨",
  Laborer: "👷",
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <section className="hero">
        <h1>Home services, made simple.</h1>
        <p>
          FixKar connects you with trusted electricians, plumbers, carpenters, AC
          technicians and more across Pakistan. Book in minutes, pay after the job.
        </p>
        <Link to="/workers" className="btn btn-primary">
          Find a Worker
        </Link>
      </section>

      <div className="container">
        <h2 className="section-title">Popular categories</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="category-tile"
              onClick={() => navigate(`/workers?category=${encodeURIComponent(cat)}`)}
            >
              <span className="emoji">{EMOJI[cat] || "🛠️"}</span>
              {cat}
            </div>
          ))}
        </div>

        <div className="center mt-2" style={{ margin: "3rem 0" }}>
          <h2>Are you a worker?</h2>
          <p className="muted">
            Create a profile, receive booking requests, and grow your rating.
          </p>
          <Link to="/register" className="btn btn-primary mt-1">
            Join as a Worker
          </Link>
        </div>
      </div>
    </div>
  );
}
