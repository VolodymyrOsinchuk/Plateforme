// src/pages/DashboardPage.jsx
import { Link } from "react-router-dom";
import { useApprenants } from "../hooks/useApprenants";
import { useAuth } from "../hooks/useAuth";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: apprenants = [], isLoading } = useApprenants();

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Formateur";
  const avgAge = apprenants.length
    ? Math.round(
        apprenants.reduce((s, a) => s + (a.age || 0), 0) / apprenants.length,
      )
    : 0;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="greeting">Bonjour, {name} 👋</p>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <Link to="/apprenants" className="btn btn-primary">
          ＋ Nouvel apprenant
        </Link>
      </header>

      <div className="stats-grid">
        <StatCard
          label="Total apprenants"
          value={isLoading ? "…" : apprenants.length}
          icon="👥"
          color="#6c63ff"
        />
        <StatCard
          label="Âge moyen"
          value={isLoading ? "…" : `${avgAge} ans`}
          icon="🎂"
          color="#ff6584"
        />
        <StatCard label="Ajoutés ce mois" value="—" icon="📅" color="#4ade80" />
        <StatCard
          label="Actifs"
          value={isLoading ? "…" : apprenants.length}
          icon="⚡"
          color="#fbbf24"
        />
      </div>

      <section className="recent-section">
        <h2 className="section-title">Derniers apprenants</h2>
        {isLoading ? (
          <div className="spinner-page">
            <div className="spinner" />
          </div>
        ) : apprenants.length === 0 ? (
          <div className="empty-dashboard">
            <p>Aucun apprenant pour l'instant.</p>
            <Link to="/apprenants" className="btn btn-primary">
              Créer le premier
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {apprenants
              .slice(-5)
              .reverse()
              .map((a) => (
                <Link
                  to={`/apprenants/${a.id}`}
                  key={a.id}
                  className="recent-item"
                >
                  <div className="recent-dot" style={{ background: a.color }} />
                  <div className="recent-info">
                    <span className="recent-name">{a.name}</span>
                    <span className="recent-age">{a.age} ans</span>
                  </div>
                  <span className="recent-arrow">→</span>
                </Link>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}22`, color }}>
        {icon}
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}
