import { useState, useContext, useEffect } from "react";
import { AppContext } from "./App";
import Sidebar from "./Sidebar";
import { useToast, ToastContainer } from "./Toast";
import * as api from "./api";
import "./Dashboard.css";
import "./AdminExtra.css";

const LINKS = [
  { id: "home", label: "Overview", icon: "📊" },
  { id: "workers", label: "Workers", icon: "🔧" },
  { id: "bookings", label: "Bookings", icon: "📅" },
  { id: "admins", label: "Admins", icon: "🛡️" },
 ];

const CAT_ICONS = { plumber:"🔧", electrician:"⚡", painter:"🎨", carpenter:"🪚", cleaner:"🧹", gardener:"🌿", mechanic:"🔩", other:"🛠️" };

export default function AdminDashboard() {
  const { user } = useContext(AppContext);
  const { toasts, addToast } = useToast();
  const [active, setActive] = useState("home");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workerSearch, setWorkerSearch] = useState("");
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [adminModal, setAdminModal] = useState(false);

  const token = user?.token;

  useEffect(() => {
    if (active === "workers" || active === "home") loadWorkers();
  }, [active]);

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await axios.get("http://localhost:5000/api/worker", { headers: { Authorization: `Bearer ${token}` } });
      setWorkers(data.workers || []);
    } catch (e) {
      addToast(e.message, "error");
    } finally { setLoading(false); }
  };

  const deleteWorker = async (email) => {
    if (!confirm("Delete this worker?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/worker/${email}`, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Worker deleted");
      loadWorkers();
    } catch (e) { addToast(e.message, "error"); }
  };

  const createAdmin = async () => {
    try {
      await axios.post("http://localhost:5000/api/admin/create", newAdmin, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Admin created!");
      setAdminModal(false);
      setNewAdmin({ name: "", email: "", password: "" });
    } catch (e) { addToast(e.message, "error"); }
  };

  const filteredWorkers = workers.filter(w =>
    w.name?.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.serviceType?.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.email?.toLowerCase().includes(workerSearch.toLowerCase())
  );

  const byCategory = workers.reduce((acc, w) => {
    acc[w.serviceType] = (acc[w.serviceType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard-layout">
      <Sidebar links={LINKS} active={active} setActive={setActive} />
      <main className="dashboard-main">

        {/* OVERVIEW */}
        {active === "home" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">Admin Overview</h1>
                <p className="dash-sub">Platform health and quick stats</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setAdminModal(true)}>+ New Admin</button>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Total Workers</div>
                <div className="stat-value">{workers.length}</div>
                <div className="stat-sub">Registered</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Verified</div>
                <div className="stat-value">{workers.filter(w => w.isVerified).length}</div>
                <div className="stat-sub">Active professionals</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Available Now</div>
                <div className="stat-value">{workers.filter(w => w.isAvailable).length}</div>
                <div className="stat-sub">Ready to book</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Categories</div>
                <div className="stat-value">{Object.keys(byCategory).length}</div>
                <div className="stat-sub">Service types</div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="section-header">
              <h3 className="section-title">Workers by Category</h3>
            </div>
            <div className="category-breakdown">
              {Object.entries(byCategory).map(([cat, count]) => (
                <div key={cat} className="cat-breakdown-card card">
                  <span className="cat-icon">{CAT_ICONS[cat] || "🛠️"}</span>
                  <div className="cat-breakdown-info">
                    <div className="cat-breakdown-name">{cat}</div>
                    <div className="cat-breakdown-count">{count} workers</div>
                  </div>
                  <div className="cat-bar-wrap">
                    <div className="cat-bar" style={{ width: `${Math.round((count / workers.length) * 100)}%` }} />
                  </div>
                  <div className="cat-pct">{Math.round((count / workers.length) * 100)}%</div>
                </div>
              ))}
            </div>

            {/* Recent workers */}
            <div className="section-header" style={{ marginTop: 32 }}>
              <h3 className="section-title">Recent Workers</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActive("workers")}>View All →</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Worker</th><th>Category</th><th>Rating</th><th>Status</th><th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5}><div className="empty-state"><span className="spinner" /></div></td></tr>
                  ) : workers.slice(0, 5).map(w => (
                    <tr key={w._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar">{w.image ? <img src={w.image} alt="" /> : w.name?.[0]}</div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{w.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text3)" }}>{w.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="tag tag-provider">{CAT_ICONS[w.serviceType]} {w.serviceType}</span></td>
                      <td>⭐ {w.rating?.toFixed(1) || "—"}</td>
                      <td><span className={`tag tag-${w.isAvailable ? "accepted" : "cancelled"}`}>{w.isAvailable ? "Available" : "Busy"}</span></td>
                      <td>{w.isVerified ? <span className="verified-badge">✓ Yes</span> : <span style={{ color: "var(--text3)", fontSize: 12 }}>Pending</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKERS */}
        {active === "workers" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <h1 className="dash-title">All Workers</h1>
              <button className="btn btn-ghost btn-sm" onClick={loadWorkers}>↻ Refresh</button>
            </div>

            <input
              className="form-input"
              style={{ marginBottom: 20, maxWidth: 400 }}
              placeholder="🔍 Search by name, email, or category..."
              value={workerSearch}
              onChange={e => setWorkerSearch(e.target.value)}
            />

            {loading ? <div className="empty-state"><span className="spinner" /></div> : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Worker</th><th>Category</th><th>Experience</th><th>Rating</th><th>Status</th><th>Verified</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkers.length === 0 ? (
                      <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">🔍</div><p>No workers found</p></div></td></tr>
                    ) : filteredWorkers.map(w => (
                      <tr key={w._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="avatar">{w.image ? <img src={w.image} alt="" /> : w.name?.[0]}</div>
                            <div>
                              <div style={{ fontWeight: 500 }}>{w.name}</div>
                              <div style={{ fontSize: 11, color: "var(--text3)" }}>{w.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="tag tag-provider">{CAT_ICONS[w.serviceType]} {w.serviceType}</span></td>
                        <td style={{ color: "var(--text2)" }}>{w.experience} yrs</td>
                        <td>⭐ {w.rating?.toFixed(1) || "—"}</td>
                        <td><span className={`tag tag-${w.isAvailable ? "accepted" : "cancelled"}`}>{w.isAvailable ? "Available" : "Busy"}</span></td>
                        <td>{w.isVerified ? <span className="verified-badge">✓</span> : <span style={{ color: "var(--text3)", fontSize: 12 }}>Pending</span>}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteWorker(w.email)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {active === "bookings" && (
          <div className="dashboard-content">
            <h1 className="dash-title">All Bookings</h1>
            <div className="empty-state" style={{ marginTop: 40 }}>
              <div className="empty-icon">📅</div>
              <p>Booking management coming soon.<br />Use the API to query bookings by user/worker.</p>
            </div>
          </div>
        )}

        {/* ADMINS */}
        {active === "admins" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <h1 className="dash-title">Admin Management</h1>
              <button className="btn btn-primary btn-sm" onClick={() => setAdminModal(true)}>+ Create Admin</button>
            </div>
            <div className="card" style={{ marginTop: 20 }}>
              <div className="profile-header">
                <div className="avatar avatar-lg">{user?.name?.[0]}</div>
                <div>
                  <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ color: "var(--text2)", fontSize: 13 }}>{user?.email}</div>
                  <span className="tag tag-admin" style={{ marginTop: 8 }}>Admin</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Admin Modal */}
      {adminModal && (
        <div className="modal-overlay" onClick={() => setAdminModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Syne", marginBottom: 20 }}>Create New Admin</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["name","Name","John Admin"],["email","Email","admin@example.com"],["password","Password","••••••••"]].map(([k,l,p]) => (
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input type={k === "password" ? "password" : "text"} className="form-input" placeholder={p}
                    value={newAdmin[k]} onChange={e => setNewAdmin(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAdminModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={createAdmin}>Create Admin</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
