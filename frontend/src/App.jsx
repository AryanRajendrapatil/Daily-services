import { useState, useEffect, createContext, useContext } from "react";
import AuthPage from "./AuthPage";
import UserDashboard from "./UserDashboard";
import WorkerDashboard from "./WorkerDashboard";
import AdminDashboard from "./AdminDashboard";
import LandingPage from "./LandingPage";
import "./App.css";

export const AppContext = createContext(null);

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("landing"); // landing | auth | dashboard

  useEffect(() => {
    const stored = localStorage.getItem("ds_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setPage("dashboard");
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("ds_user", JSON.stringify({ ...userData, token }));
    setUser({ ...userData, token });
    setPage("dashboard");
  };

  const logout = () => {
    localStorage.removeItem("ds_user");
    setUser(null);
    setPage("landing");
  };

  const renderDashboard = () => {
    if (!user) return null;
    const role = user.role || "client";
    if (role === "admin") return <AdminDashboard />;
    if (role === "provider") return <WorkerDashboard />;
    return <UserDashboard />;
  };

  return (
    <AppContext.Provider value={{ user, login, logout, setPage }}>
      <div className="app-root">
        {page === "landing" && <LandingPage />}
        {page === "auth" && <AuthPage />}
        {page === "dashboard" && renderDashboard()}
      </div>
    </AppContext.Provider>
  );
}
