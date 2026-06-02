import { useState, useContext, useEffect } from "react";
import { AppContext } from "./App";
import Sidebar from "./Sidebar";
import { useToast, ToastContainer } from "./Toast";
import * as api from "./api";
import "./Dashboard.css";

const LINKS = [
  { id: "home",     label: "Home",         icon: "🏠" },
  { id: "workers",  label: "Find Workers", icon: "🔍" },
  { id: "bookings", label: "My Bookings",  icon: "📅" },
  { id: "profile",  label: "Profile",      icon: "👤" },
];

const CATEGORIES = ["plumber","electrician","painter","carpenter","cleaner","gardener","mechanic","other"];
const CAT_ICONS = { plumber:"🔧", electrician:"⚡", painter:"🎨", carpenter:"🪚", cleaner:"🧹", gardener:"🌿", mechanic:"🔩", other:"🛠️" };

export default function UserDashboard() {
  const { user } = useContext(AppContext);
  const { toasts, addToast } = useToast();
  const [active, setActive] = useState("home");
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingModal, setBookingModal] = useState(null);
  const [bookForm, setBookForm] = useState({ bookingDate: "", bookingTime: "", serviceId: "" });

  const token = user?.token;

  useEffect(() => {
    if (active === "workers")  loadWorkers();
    if (active === "bookings") loadBookings();
  }, [active]);

  const loadWorkers = async (cat) => {
    setLoading(true);
    try {
      let data;
      if (cat) data = await axios.get(`http://localhost:5000/api/worker/category/${cat}`, { headers: { Authorization: `Bearer ${token}` } });
      else     data = await axios.get("http://localhost:5000/api/worker", { headers: { Authorization: `Bearer ${token}` } });
      setWorkers(data.workers || []);
    } catch (e) { addToast(e.message, "error"); }
    finally { setLoading(false); }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`http://localhost:5000/api/booking/user/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBookings(data.bookings || []);
    } catch (e) { addToast(e.message, "error"); }
    finally { setLoading(false); }
  };

  const handleBook = async () => {
    if (!bookForm.bookingDate || !bookForm.bookingTime) { addToast("Fill all fields", "error"); return; }
    try {
      await axios.post("http://localhost:5000/api/booking/create", {
        userId: user._id, workerId: bookingModal._id,
        serviceId: bookForm.serviceId || "general",
        bookingDate: bookForm.bookingDate, bookingTime: bookForm.bookingTime,
        location: user.location, bookingStatus: "pending", paymentStatus: "pending"
      }, token);
      addToast("Booking created!"); setBookingModal(null);
    } catch (e) { addToast(e.message, "error"); }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/booking/user-cancel/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Booking cancelled"); loadBookings();
    } catch (e) { addToast(e.message, "error"); }
  };

  const filterCat = (cat) => { setSelectedCategory(cat); loadWorkers(cat); };

  return (
    <div className="dashboard-layout">
      <Sidebar links={LINKS} active={active} setActive={setActive} />
      <main className="dashboard-main">

        {active === "home" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <div>
                <h1 className="dash-title">
                  Good day, <span className="accent-text">{user?.name?.split(" ")[0]}</span> 👋
                </h1>
                <p className="dash-sub">What service can we help you with today?</p>
              </div>
            </div>

            <div className="hero-search-bar" onClick={() => setActive("workers")}>
              <span style={{ fontSize: 18 }}>🔍</span>
              <span style={{ color: "var(--text3)", fontSize: 14, fontFamily: "Outfit, sans-serif", flex: 1 }}>
                Search for a service...
              </span>
              <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); setActive("workers"); }}>
                Browse All
              </button>
            </div>

            <h3 className="section-title" style={{ marginBottom: 18 }}>Browse by Category</h3>
            <div className="category-grid">
              {CATEGORIES.map(c => (
                <div key={c} className="category-card" onClick={() => { setActive("workers"); filterCat(c); }}>
                  <span className="cat-icon">{CAT_ICONS[c]}</span>
                  <span className="cat-label">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginTop: 36 }}>
              <div className="stat-card">
                <div className="stat-label">Active Bookings</div>
                <div className="stat-value">{bookings.filter(b => b.bookingStatus !== "completed" && b.bookingStatus !== "cancelled").length || "—"}</div>
                <div className="stat-sub">Currently in progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Bookings</div>
                <div className="stat-value">{bookings.length || "—"}</div>
                <div className="stat-sub">All time</div>
              </div>
            </div>
          </div>
        )}

        {active === "workers" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <h1 className="dash-title">Find Workers</h1>
              <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedCategory(null); loadWorkers(); }}>Clear Filter</button>
            </div>
            <div className="cat-filter-row">
              {CATEGORIES.map(c => (
                <button key={c} className={`cat-filter-btn ${selectedCategory === c ? "active" : ""}`} onClick={() => filterCat(c)}>
                  {CAT_ICONS[c]} {c}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="empty-state"><span className="spinner" /></div>
            ) : workers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div><p>No workers found</p>
              </div>
            ) : (
              <div className="workers-grid">
                {workers.map(w => (
                  <div key={w._id} className="worker-card card card-glow">
                    <div className="worker-card-top">
                      <div className="avatar avatar-lg">
                        {w.image ? <img src={w.image} alt="" /> : w.name?.[0]}
                      </div>
                      <div>
                        <div className="worker-name">{w.name}</div>
                        <div className="tag tag-provider" style={{ marginTop: 5 }}>{CAT_ICONS[w.serviceType]} {w.serviceType}</div>
                      </div>
                      <div className="worker-rating">★ {w.rating?.toFixed(1) || "New"}</div>
                    </div>
                    <div className="worker-meta">
                      <span>{w.experience} yrs exp.</span>
                      <span className={`status-dot ${w.isAvailable ? "green" : "red"}`}>{w.isAvailable ? "Available" : "Busy"}</span>
                    </div>
                    {w.isAvailable && (
                      <button className="btn btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => setBookingModal(w)}>
                        Book Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {active === "bookings" && (
          <div className="dashboard-content">
            <div className="dash-header">
              <h1 className="dash-title">My Bookings</h1>
              <button className="btn btn-ghost btn-sm" onClick={loadBookings}>↻ Refresh</button>
            </div>
            {loading ? <div className="empty-state"><span className="spinner" /></div>
              : bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <p>No bookings yet. <button className="auth-link" style={{ fontSize: 14 }} onClick={() => setActive("workers")}>Find a worker →</button></p>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map(b => (
                    <div key={b._id} className="booking-card card">
                      <div className="booking-card-row">
                        <div>
                          <div className="booking-title">Booking #{b._id?.slice(-6)}</div>
                          <div className="booking-meta">📅 {new Date(b.bookingDate).toLocaleDateString()} &nbsp; 🕐 {b.bookingTime}</div>
                          <div className="booking-meta">📍 {b.location}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          <span className={`tag tag-${b.bookingStatus}`}>{b.bookingStatus}</span>
                          <span className={`tag tag-${b.paymentStatus === "completed" ? "accepted" : "pending"}`}>{b.paymentStatus}</span>
                        </div>
                      </div>
                      {b.bookingStatus === "pending" && (
                        <button className="btn btn-danger btn-sm" style={{ marginTop: 14 }} onClick={() => cancelBooking(b._id)}>
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {active === "profile" && (
          <div className="dashboard-content">
            <h1 className="dash-title">Profile</h1>
            <div className="profile-card card" style={{ marginTop: 22 }}>
              <div className="profile-header">
                <div className="avatar avatar-lg">{user?.name?.[0]}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Playfair Display, serif" }}>{user?.name}</div>
                  <div style={{ color: "var(--text2)", fontSize: 13, fontFamily: "Outfit, sans-serif", marginTop: 4 }}>{user?.email}</div>
                  <div className="tag tag-client" style={{ marginTop: 10 }}>{user?.role}</div>
                </div>
              </div>
              <hr className="divider" />
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <div className="profile-info-val">{user?.phone || "Not set"}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Member Since</label>
                  <div className="profile-info-val">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {bookingModal && (
        <div className="modal-overlay" onClick={() => setBookingModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Playfair Display, serif", marginBottom: 8, fontSize: 22 }}>
              Book {bookingModal.name}
            </h3>
            <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 24, fontFamily: "Outfit, sans-serif" }}>
              {CAT_ICONS[bookingModal.serviceType]} {bookingModal.serviceType} · ★ {bookingModal.rating?.toFixed(1) || "New"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Service</label>
                <select className="form-input" value={bookForm.serviceId} onChange={e => setBookForm(f => ({ ...f, serviceId: e.target.value }))}>
                  <option value="">General Service</option>
                  {bookingModal.services?.map(s => <option key={s._id} value={s._id}>{s.title} — ₹{s.price}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={bookForm.bookingDate} onChange={e => setBookForm(f => ({ ...f, bookingDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input type="time" className="form-input" value={bookForm.bookingTime} onChange={e => setBookForm(f => ({ ...f, bookingTime: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setBookingModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleBook}>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
