import { useContext } from "react";
import { AppContext } from "./App";
import "./LandingPage.css";
import logoImg from "./assets/logo.png";

const services = [
  { icon: "🔧", label: "Plumber" },
  { icon: "⚡", label: "Electrician" },
  { icon: "🎨", label: "Painter" },
  { icon: "🪚", label: "Carpenter" },
  { icon: "🧹", label: "Cleaner" },
  { icon: "🌿", label: "Gardener" },
  { icon: "🔩", label: "Mechanic" },
  { icon: "👨‍🍳", label: "Cook" },
];

export default function LandingPage() {
  const { setPage } = useContext(AppContext);

  return (
    <div className="landing">
      <div className="landing-grid-bg" />

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <img src={logoImg} alt="Daily Helper Logo" className="logo-img" />
          <span className="logo-text">Daily Helper</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => setPage("auth")}>Sign In</button>
          <button className="btn btn-primary" onClick={() => setPage("auth")}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          Trusted by 10,000+ households
        </div>
        <h1 className="hero-title">
          Every Home Service,<br />
          <span className="accent-text">On Demand.</span>
        </h1>
        <p className="hero-sub">
          Connect with verified plumbers, electricians, painters, and more —
          booked in minutes, delivered with excellence.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => setPage("auth")}>
            Book a Service
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => setPage("auth")}>
            Join as Worker
          </button>
        </div>
        <div className="service-chips">
          {services.map((s) => (
            <div key={s.label} className="service-chip">
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Portals */}
      <section className="portals-section">
        <p className="portals-label">— Choose your portal —</p>
        <div className="portals-grid">
          <div className="portal-card" onClick={() => setPage("auth")}>
            <div className="portal-icon-wrap">👤</div>
            <h3>User Portal</h3>
            <p>Browse workers, book services, and track your appointments in real time.</p>
            <span className="portal-arrow">Enter portal →</span>
          </div>
          <div className="portal-card portal-featured" onClick={() => setPage("auth")}>
            <div className="portal-badge">Most Popular</div>
            <div className="portal-icon-wrap">🔧</div>
            <h3>Worker Portal</h3>
            <p>Manage your bookings, showcase your skills, and grow your business.</p>
            <span className="portal-arrow">Enter portal →</span>
          </div>
          <div className="portal-card" onClick={() => setPage("auth")}>
            <div className="portal-icon-wrap">🛡️</div>
            <h3>Admin Portal</h3>
            <p>Oversee platform health, manage users, workers, and resolve disputes.</p>
            <span className="portal-arrow">Enter portal →</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-item"><span className="s-val">10K+</span><span className="s-lbl">Happy Users</span></div>
        <div className="stat-div" />
        <div className="stat-item"><span className="s-val">2K+</span><span className="s-lbl">Verified Workers</span></div>
        <div className="stat-div" />
        <div className="stat-item"><span className="s-val">50K+</span><span className="s-lbl">Jobs Completed</span></div>
        <div className="stat-div" />
        <div className="stat-item"><span className="s-val">4.9★</span><span className="s-lbl">Avg. Rating</span></div>
      </section>

      <footer className="landing-footer">
        <span>© 2025 Daily Helper. All rights reserved.</span>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
