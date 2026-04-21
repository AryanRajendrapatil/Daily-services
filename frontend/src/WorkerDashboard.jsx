import { useState, useContext, useEffect } from "react";
import { AppContext } from "./App";
import Sidebar from "./Sidebar";
import { useToast, ToastContainer } from "./Toast";
import * as api from "./api";
import "./Dashboard.css";

const LINKS = [
  { id: "home", label: "Dashboard", icon: "📊" },
  { id: "bookings", label: "My Bookings", icon: "📅" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "password", label: "Change Password", icon: "🔒" },
];

const STATUS_COLORS = { pending: "pending", accepted: "accepted", completed: "completed", rejected: "cancelled", cancelled: "cancelled" };

export default function WorkerDashboard() {
  const { user } = useContext(AppContext);
  const { toasts, addToast } = useToast();
  const [active, setActive] = useState("home");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ email: user?.email || "", password: "", newPassword: "" });

  const token = user?.token;

  useEffect(() => {
    if (active === "bookings" || active === "home") loadBookings();
  }, [active]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`http://localhost:5000/api/booking/worker/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBookings(data.bookings || []);
    } catch (e) {
      addToast(e.message, "error");
    } finally { setLoading(false); }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/booking/update/${bookingId}`, { bookingStatus: status }, { headers: { Authorization: `Bearer ${token}` } });
      addToast(`Booking ${status}`);
      loadBookings();
    } catch (e) { addToast(e.message, "error"); }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/booking/worker-cancel/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Booking cancelled");
      loadBookings();
    } catch (e) { addToast(e.message, "error"); }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put("http://localhost:5000/api/worker/change-password", { email: pwForm.email, password: pwForm.password }, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Password changed successfully!");
      setPwForm(f => ({ ...f, password: "", newPassword: "" }));
    } catch (e) { addToast(e.message, "error"); }
  };

  const pending = bookings.filter(b => b.bookingStatus === "pending");
  const accepted = bookings.filter(b => b.bookingStatus === "accepted");
  const completed = bookings.filter(b => b.bookingStatus === "completed");

  return (
    <div className="dashboard-layout">
      <Sidebar links={LINKS} active={active} setActive={setActive} />
      <main className="dashboard-main">

        {/* HOME */}
        {active === "home" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">Worker Dashboard</h1>
                <p className="dash-sub">
                  {user?.serviceType ? `${user.serviceType} · ` : ""}
                  {user?.experience} yrs experience
                  {user?.isVerified ? " · ✓ Verified" : " · Pending verification"}
                </p>
              </div>
              <div className={`tag tag-${user?.isAvailable ? "accepted" : "cancelled"}`}>
                {user?.isAvailable ? "🟢 Available" : "🔴 Unavailable"}
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{pending.length}</div>
                <div className="stat-sub">Awaiting response</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active</div>
                <div className="stat-value">{accepted.length}</div>
                <div className="stat-sub">In progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Completed</div>
                <div className="stat-value">{completed.length}</div>
                <div className="stat-sub">All time</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Rating</div>
                <div className="stat-value">{user?.rating?.toFixed(1) || "—"}</div>
                <div className="stat-sub">⭐ Average</div>
              </div>
            </div>

            {/* Recent pending */}
            <div className="section-header">
              <h3 className="section-title">Pending Requests</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActive("bookings")}>View All →</button>
            </div>
            {loading ? <div className="empty-state"><span className="spinner" /></div>
              : pending.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>No pending bookings</p>
                </div>
              ) : pending.slice(0, 3).map(b => (
                <BookingRow key={b._id} b={b} onAccept={() => updateStatus(b._id, "accepted")} onReject={() => updateStatus(b._id, "rejected")} onCancel={() => cancelBooking(b._id)} />
              ))}
          </div>
        )}

        {/* BOOKINGS */}
        {active === "bookings" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <h1 className="dash-title">All Bookings</h1>
              <button className="btn btn-ghost btn-sm" onClick={loadBookings}>↻ Refresh</button>
            </div>

            {loading ? <div className="empty-state"><span className="spinner" /></div>
              : bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <p>No bookings yet</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map(b => (
                    <BookingRow
                      key={b._id} b={b}
                      onAccept={b.bookingStatus === "pending" ? () => updateStatus(b._id, "accepted") : null}
                      onComplete={b.bookingStatus === "accepted" ? () => updateStatus(b._id, "completed") : null}
                      onCancel={b.bookingStatus !== "completed" && b.bookingStatus !== "cancelled" ? () => cancelBooking(b._id) : null}
                    />
                  ))}
                </div>
              )}
          </div>
        )}

        {/* PROFILE */}
        {active === "profile" && (
          <div className="dashboard-content">
            <h1 className="dash-title">My Profile</h1>
            <div className="card" style={{ marginTop: 20 }}>
              <div className="profile-header">
                <div className="avatar avatar-lg">
                  {user?.image ? <img src={user.image} alt="" /> : user?.name?.[0]}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "Syne, sans-serif" }}>{user?.name}</div>
                  <div style={{ color: "var(--text2)", fontSize: 13 }}>{user?.email}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <span className="tag tag-provider">{user?.serviceType}</span>
                    {user?.isVerified && <span className="tag tag-accepted">✓ Verified</span>}
                  </div>
                </div>
              </div>
              <hr className="divider" />
              <div className="grid-2">
                {[
                  ["Experience", `${user?.experience} years`],
                  ["Rating", user?.rating?.toFixed(1) || "No ratings yet"],
                  ["Phone", user?.phone || "Not set"],
                  ["Status", user?.isAvailable ? "Available" : "Unavailable"],
                ].map(([label, val]) => (
                  <div key={label} className="form-group">
                    <label className="form-label">{label}</label>
                    <div className="profile-info-val">{val}</div>
                  </div>
                ))}
              </div>
              {user?.document && (
                <>
                  <hr className="divider" />
                  <h4 style={{ fontFamily: "Syne", marginBottom: 12 }}>Documents</h4>
                  <div className="grid-3">
                    {user.document.adhar_card_front && <div className="doc-preview">Aadhar Front <span className="tag tag-accepted">✓</span></div>}
                    {user.document.adhar_card_back && <div className="doc-preview">Aadhar Back <span className="tag tag-accepted">✓</span></div>}
                    {user.document.photo && <div className="doc-preview">Photo <span className="tag tag-accepted">✓</span></div>}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* CHANGE PASSWORD */}
        {active === "password" && (
          <div className="dashboard-content">
            <h1 className="dash-title">Change Password</h1>
            <div className="card" style={{ marginTop: 20, maxWidth: 440 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" value={pwForm.password} onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                </div>
                <button className="btn btn-primary" onClick={handlePasswordChange}>Update Password</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

function BookingRow({ b, onAccept, onReject, onComplete, onCancel }) {
  return (
    <div className="booking-card card">
      <div className="booking-card-row">
        <div>
          <div className="booking-title">Booking #{b._id?.slice(-6)}</div>
          <div className="booking-meta">📅 {new Date(b.bookingDate).toLocaleDateString()} &nbsp; 🕐 {b.bookingTime}</div>
          <div className="booking-meta">📍 {b.location}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          <span className={`tag tag-${b.bookingStatus}`}>{b.bookingStatus}</span>
          <span className={`tag tag-${b.paymentStatus === "completed" ? "accepted" : "pending"}`}>{b.paymentStatus}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {onAccept && <button className="btn btn-primary btn-sm" onClick={onAccept}>✓ Accept</button>}
        {onComplete && <button className="btn btn-secondary btn-sm" onClick={onComplete}>✓ Complete</button>}
        {onReject && <button className="btn btn-danger btn-sm" onClick={onReject}>✕ Reject</button>}
        {onCancel && <button className="btn btn-danger btn-sm" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
