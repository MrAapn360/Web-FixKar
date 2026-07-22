// Three-phone showcase section for the landing page, inspired by modern
// mobile app marketing pages: a focused/elevated center screen with two
// angled, faded side screens. Built entirely with CSS phone frames + mock
// UI content — no external mockup images required.
export default function AppShowcase() {
  return (
    <section className="showcase">
      <div className="showcase-copy">
        <h2>One app, every home service</h2>
        <p className="muted">
          Browse trusted workers, check real profiles, and confirm your booking —
          all in a few taps.
        </p>
      </div>

      <div className="showcase-phones">
        {/* Left phone: Browsing services */}
        <div className="phone phone-side phone-left">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="mock-search" />
            <div className="mock-chip-row">
              <span className="mock-chip mock-chip-active" />
              <span className="mock-chip" />
              <span className="mock-chip" />
            </div>
            <div className="mock-hero" />
            <div className="mock-promo" />
            <div className="mock-promo mock-promo-alt" />
          </div>
        </div>

        {/* Center phone: Viewing worker profile */}
        <div className="phone phone-center">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="mock-back" />
            <div className="mock-profile-avatar" />
            <div className="mock-profile-name" />
            <div className="mock-profile-sub" />
            <div className="mock-stats-row">
              <span className="mock-stat" />
              <span className="mock-stat" />
              <span className="mock-stat" />
            </div>
            <div className="mock-book-btn" />
          </div>
        </div>

        {/* Right phone: Booking confirmation */}
        <div className="phone phone-side phone-right">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="mock-check-circle">✓</div>
            <div className="mock-confirm-title" />
            <div className="mock-confirm-sub" />
            <div className="mock-confirm-card" />
            <div className="mock-confirm-btn" />
          </div>
        </div>
      </div>
    </section>
  );
}
