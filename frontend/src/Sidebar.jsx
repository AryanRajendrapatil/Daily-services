import { useContext } from "react";
import { AppContext } from "./App";
import "./Sidebar.css";
import logoImg from "./assets/logo.png";

export default function Sidebar({ links, active, setActive }) {
  const { user, logout } = useContext(AppContext);
  const initial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logoImg} alt="Daily Helper Logo" className="logo-img" />
        <span className="logo-text">Daily Helper</span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">
          {user?.image ? <img src={user.image} alt="" /> : initial}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || "User"}</div>
          <div className={`tag tag-${user?.role === "client" ? "client" : user?.role === "admin" ? "admin" : "provider"}`}
            style={{ fontSize: 10, padding: "2px 8px" }}>
            {user?.role || "client"}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <button key={link.id}
            className={`sidebar-link ${active === link.id ? "active" : ""}`}
            onClick={() => setActive(link.id)}>
            <span className="sidebar-icon">{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />
      <button className="sidebar-logout" onClick={logout}>
        <span>⏏</span> Sign Out
      </button>
    </aside>
  );
}
