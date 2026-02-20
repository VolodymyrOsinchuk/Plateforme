// src/pages/NotFoundPage.jsx
import { Link, useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Page introuvable</h1>
        <p className="notfound-desc">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="notfound-actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← Retour
          </button>
          <Link to="/" className="btn btn-primary">
            🏠 Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
