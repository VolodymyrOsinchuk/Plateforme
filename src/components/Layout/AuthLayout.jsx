// src/components/Layout/AuthLayout.jsx
import { Outlet } from "react-router-dom";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-grid">
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-badge">✦ Plateforme de formation</div>
            <h1 className="brand-title">Gérez vos apprenants avec clarté</h1>
            <p className="brand-desc">
              Suivez, modifiez et organisez vos apprenants en temps réel depuis
              une interface pensée pour les formateurs.
            </p>
            <div className="brand-stats">
              <div className="stat">
                <span>∞</span>
                <small>Apprenants</small>
              </div>
              <div className="stat">
                <span>⚡</span>
                <small>Temps réel</small>
              </div>
              <div className="stat">
                <span>🔒</span>
                <small>Sécurisé</small>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-form-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
