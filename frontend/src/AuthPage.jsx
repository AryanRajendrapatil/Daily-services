import { useState, useContext } from "react";
import { AppContext } from "./App";
import * as api from "./api";
import "./AuthPage.css";

const ROLES = [
  { key: "client", label: "User", icon: "👤", desc: "Book home services" },
  { key: "provider", label: "Worker", icon: "🔧", desc: "Offer your skills" },
  { key: "admin", label: "Admin", icon: "🛡️", desc: "Manage the platform" },
];

export default function AuthPage() {
  const { login, setPage } = useContext(AppContext);
  const [mode, setMode] = useState("login"); // login | register
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      let data;
      if (role === "client") data = await axios.post("http://localhost:5000/api/user/login", { email: form.email, password: form.password });
      else if (role === "provider") data = await axios.post("http://localhost:5000/api/worker/login", { email: form.email, password: form.password });
      else data = await axios.post("http://localhost:5000/api/admin/login", { email: form.email, password: form.password });

      const userData = data.user || data.worker || data.admin;
      login(userData, data.token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(""); setLoading(true);
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match"); setLoading(false); return;
    }
    try {
      let data;
      if (role === "client") {
        const fd = new FormData();
        fd.append("name", form.name); fd.append("email", form.email); fd.append("password", form.password);
        data = await axios.post("http://localhost:5000/api/user/create", fd);
      } else if (role === "provider") {
        const fd = new FormData();
        fd.append("name", form.name); fd.append("email", form.email); fd.append("password", form.password);
        data = await axios.post("http://localhost:5000/api/worker/create", fd);
      } else {
        data = await axios.post("http://localhost:5000/api/admin/create", { name: form.name, email: form.email, password: form.password });
      }
      // Auto-login after register
      setMode("login");
      setError("Account created! Please log in.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      <button className="auth-back" onClick={() => setPage("landing")}>← Back</button>

      <div className="auth-container">
        {/* Left brand panel */}
        <div className="auth-brand">
          <div className="auth-brand-inner">
            <div className="landing-logo" style={{ marginBottom: 40 }}>
              <div className="logo-mark">DS</div>
              <span className="logo-text">DailyServe</span>
            </div>
            <h2 className="auth-brand-title">Your City's<br />Best Workers,<br /><span className="accent-text">One Tap Away.</span></h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, marginTop: 20 }}>
              Plumbers, Electricians, Painters & more —<br />verified, rated, and ready to help.
            </p>

            <div className="auth-features">
              {["✓ Verified professionals", "✓ Real-time tracking", "✓ Secure payments", "✓ 24/7 support"].map(f => (
                <div key={f} className="auth-feature">{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            {/* Mode toggle */}
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(""); }}>Sign In</button>
              <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => { setMode("register"); setError(""); }}>Create Account</button>
            </div>

            <h2 className="auth-form-title">
              {mode === "login" ? "Welcome back" : "Join DailyServe"}
            </h2>

            {/* Role selector */}
            <div className="role-selector">
              {ROLES.map(r => (
                <button
                  key={r.key}
                  className={`role-btn ${role === r.key ? "active" : ""}`}
                  onClick={() => setRole(r.key)}
                >
                  <span>{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                </button>
              ))}
            </div>

            {/* Error */}
            {error && <div className="auth-error">{error}</div>}

            {/* Form */}
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

            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 8 }}
              onClick={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : mode === "login" ? `Sign In as ${ROLES.find(r => r.key === role)?.label}` : "Create Account"}
            </button>

            <p className="auth-switch">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button className="auth-link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div> 
  );
}
