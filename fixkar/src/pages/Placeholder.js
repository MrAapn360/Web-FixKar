import { Link } from "react-router-dom";

// Temporary stand-in for pages built in later phases (see ROADMAP.md).
// Keeps every route wired so the skeleton is navigable end to end.
export default function Placeholder({ title, phase }) {
  return (
    <div className="page container">
      <div className="card" style={{ maxWidth: 560, margin: "3rem auto", textAlign: "center" }}>
        <h2>{title}</h2>
        <p className="muted mt-1">
          This page is coming in <b>{phase}</b> of the build.
        </p>
        <p className="muted">The route is wired and ready — content lands next.</p>
        <Link to="/" className="btn btn-outline btn-sm mt-2">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
