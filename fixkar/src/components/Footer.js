import { useState } from "react";
import { Link } from "react-router-dom";

// Site-wide footer: newsletter CTA strip + link columns + brand/copyright row.
// Shown at the bottom of the landing page (and can be reused elsewhere).
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <div>
            <h3>Get latest updates and special offers</h3>
          </div>
          <form className="footer-cta-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
        {subscribed && (
          <p className="footer-cta-success">Thanks — you're subscribed!</p>
        )}

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/workers">Find Workers</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/workers?category=Electrician">Electrician</Link>
            <Link to="/workers?category=Plumber">Plumber</Link>
            <Link to="/workers?category=Carpenter">Carpenter</Link>
            <Link to="/workers?category=AC%20Technician">AC Technician</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <span className="footer-link-disabled">Terms &amp; Conditions</span>
            <span className="footer-link-disabled">Privacy Policy</span>
            <a href="mailto:support@fixkar.com">Contact Support</a>
          </div>
          <div className="footer-col">
            <h4>Contact Info</h4>
            <span className="muted">Need help? Email us</span>
            <a href="mailto:support@fixkar.com" className="footer-contact-highlight">
              support@fixkar.com
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-brand">
            <img src="/app-logo.png" alt="" />
            <span>
              Fix<span style={{ color: "var(--primary)" }}>Kar</span>
            </span>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} FixKar. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
