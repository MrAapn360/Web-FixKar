// Branded splash screen shown briefly while AuthContext restores the
// session on first load — matches the mobile app's splash screen.
export default function Splash() {
  return (
    <div className="splash">
      <img src="/app-icon.svg" alt="FixKar" />
      <div className="splash-word">
        Fix<span>Kar</span>
      </div>
      <div className="splash-tagline">Your Local Fix, Sorted.</div>
    </div>
  );
}
