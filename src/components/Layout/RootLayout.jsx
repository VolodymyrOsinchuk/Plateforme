// src/components/Layout/RootLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import "./RootLayout.css";

export default function RootLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.info("À bientôt !");
    navigate("/login");
  };

  return (
    <div className="root-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Apprenants</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink
            to="/apprenants"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span>👥</span> Apprenants
          </NavLink>
          <NavLink
            to="/profil"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span>👤</span> Mon profil
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">
              {(user?.email?.[0] ?? "?").toUpperCase()}
            </div>
            <div className="user-meta">
              <span className="user-name">
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              </span>
              <span className="user-role">Administrateur</span>
            </div>
          </div>
          <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
