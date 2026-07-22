import { useState } from "react";

// Three-phone showcase section for the landing page. Renders real app
// screenshots inside CSS phone frames when available at the paths below —
// drop your own screenshots into public/images/showcase/ using these exact
// filenames and they'll appear automatically:
//   public/images/showcase/welcome-back.png    (left phone — login screen)
//   public/images/showcase/book-services.png   (center phone — home/services screen)
//   public/images/showcase/my-profile.png      (right phone — profile screen)
// If a file is missing, that phone falls back to a simple CSS mockup so the
// section never looks broken while screenshots are being added.
const SHOTS = {
  left: "/images/showcase/welcome-back.png",
  center: "/images/showcase/book-services.png",
  right: "/images/showcase/my-profile.png",
};

function PhoneScreen({ src, fallback, onMissing }) {
  const [missing, setMissing] = useState(false);

  if (missing) return fallback;

  return (
    <img
      src={src}
      alt=""
      className="phone-screenshot"
      onError={() => {
        setMissing(true);
        onMissing && onMissing();
      }}
    />
  );
}

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
        {/* Left phone: Welcome back / login */}
        <div className="phone phone-side phone-left">
          <div className="phone-notch" />
          <div className="phone-screen phone-screen-image">
            <PhoneScreen
              src={SHOTS.left}
              fallback={
                <>
                  <div className="mock-profile-avatar" style={{ width: 60, height: 60 }} />
                  <div className="mock-profile-name" style={{ width: "70%" }} />
                  <div className="mock-search" />
                  <div className="mock-book-btn" style={{ marginTop: "auto" }} />
                </>
              }
            />
          </div>
        </div>

        {/* Center phone: Book Home Services in Minutes */}
        <div className="phone phone-center">
          <div className="phone-notch" />
          <div className="phone-screen phone-screen-image">
            <PhoneScreen
              src={SHOTS.center}
              fallback={
                <>
                  <div className="mock-search" />
                  <div className="mock-chip-row">
                    <span className="mock-chip mock-chip-active" />
                    <span className="mock-chip" />
                    <span className="mock-chip" />
                  </div>
                  <div className="mock-hero" />
                  <div className="mock-promo" />
                  <div className="mock-promo mock-promo-alt" />
                </>
              }
            />
          </div>
        </div>

        {/* Right phone: My Profile */}
        <div className="phone phone-side phone-right">
          <div className="phone-notch" />
          <div className="phone-screen phone-screen-image">
            <PhoneScreen
              src={SHOTS.right}
              fallback={
                <>
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
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
