import { useContext } from "react";
import { AppContext } from "./App";
import "./LandingPage.css";

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
      {/* Grid bg */}
      <div className="landing-grid-bg" />

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="logo-mark">DS</span>
          <span className="logo-text">DailyServe</span>
        </div>
        <button className="btn btn-primary" onClick={() => setPage("auth")}>
          Get Started →
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">✦ Trusted by 10,000+ households</div>
        <h1 className="hero-title">
          Every Home Service,<br />
          <span className="accent-text">On Demand.</span>
        </h1>
        <p className="hero-sub">
          Connect with verified plumbers, electricians, painters, and more —<br />
          booked in minutes, delivered with care.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => setPage("auth")}>
            Book a Service
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => setPage("auth")}>
            Join as Worker
          </button>
        </div>

        {/* Service chips */}
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
            <div className="portal-icon">👤</div>
            <h3>User Portal</h3>
            <p>Browse workers, book services, track your appointments</p>
            <span className="portal-arrow">→</span>
          </div>
          <div className="portal-card portal-featured" onClick={() => setPage("auth")}>
            <div className="portal-badge">Most Popular</div>
            <div className="portal-icon">🔧</div>
            <h3>Worker Portal</h3>
            <p>Manage your bookings, showcase skills, grow your business</p>
            <span className="portal-arrow">→</span>
          </div>
          <div className="portal-card" onClick={() => setPage("auth")}>
            <div className="portal-icon">🛡️</div>
            <h3>Admin Portal</h3>
            <p>Oversee the platform, manage users and workers</p>
            <span className="portal-arrow">→</span>
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
        <span>© 2025 DailyServe. All rights reserved.</span>
      </footer>
    </div>
  );
}
