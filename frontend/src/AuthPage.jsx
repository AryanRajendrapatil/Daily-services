import { useState, useContext } from "react";
import { AppContext } from "./App";
import * as api from "./api";
import "./AuthPage.css";
import logoImg from "./assets/logo.png";

const ROLES = [
  { key: "client",   label: "User",   icon: "👤", desc: "Book home services" },
  { key: "provider", label: "Worker", icon: "🔧", desc: "Offer your skills" },
  { key: "admin",    label: "Admin",  icon: "🛡️", desc: "Manage the platform" },
];

const FEATURES = [
  "Verified professionals",
  "Real-time booking tracking",
  "Secure & fast payments",
  "24/7 priority support",
];

export default function AuthPage() {
  const { login, setPage } = useContext(AppContext);
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      let data;
      if (role === "client")        data = await api.loginUser({ email: form.email, password: form.password });
      else if (role === "provider") data = await api.loginWorker({ email: form.email, password: form.password });
      else                          data = await api.loginAdmin({ email: form.email, password: form.password });
      const userData = data.user || data.worker || data.admin;
      login(userData, data.token);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    setError(""); setLoading(true);
    if (form.password !== form.confirmPassword) { setError("Passwords don't match"); setLoading(false); return; }
    try {
      if (role === "client") {
        const fd = new FormData();
        fd.append("name", form.name); 
        fd.append("email", form.email); 
        fd.append("password", form.password);
        await api.createUser(fd);
      } else if (role === "provider") {
        const fd = new FormData();
        fd.append("name", form.name); 
        fd.append("email", form.email); 
        fd.append("password", form.password);
        await api.createWorker(fd);
      } else {
        await api.createAdmin({ name: form.name, email: form.email, password: form.password });
      }
      setMode("login"); setError("Account created! Please sign in.");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <button className="auth-back" onClick={() => setPage("landing")}>← Back</button>

      <div className="auth-container">
        {/* Brand panel */}
        <div className="auth-brand">
          <div className="auth-brand-inner">
            <div className="landing-logo">
              <img src={logoImg} alt="Daily Helper Logo" className="logo-img" />
              <span className="logo-text">Daily Helper</span>
            </div>
            <h2 className="auth-brand-title">
              Your City's<br />Best Workers,<br />
              <span className="accent-text">One Tap Away.</span>
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.75, marginTop: 20, fontFamily: "Outfit, sans-serif", fontWeight: 300 }}>
              Plumbers, Electricians, Painters & more —<br />
              verified, rated, and ready to help.
            </p>
            <div className="auth-features">
              {FEATURES.map(f => (
                <div key={f} className="auth-feature">
                  <span className="auth-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(""); }}>Sign In</button>
              <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => { setMode("register"); setError(""); }}>Create Account</button>
            </div>

            <h2 className="auth-form-title">
              {mode === "login" ? "Welcome back" : "Join Daily Helper"}
            </h2>

            <div className="role-selector">
              {ROLES.map(r => (
                <button key={r.key} className={`role-btn ${role === r.key ? "active" : ""}`} onClick={() => setRole(r.key)}>
                  <span>{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                </button>
              ))}
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-fields">
              {mode === "register" && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => set("name", e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} />
              </div>
              {mode === "register" && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} />
                </div>
              )}
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: "100%" }}
              onClick={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}>
              {loading ? <span className="spinner" /> : mode === "login"
                ? `Sign In as ${ROLES.find(r => r.key === role)?.label}`
                : "Create Account"}
            </button>

            <p className="auth-switch">
              {mode === "login" ? "New to Daily Helper?" : "Already have an account?"}{" "}
              <button className="auth-link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
