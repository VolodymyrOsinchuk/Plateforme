// src/pages/ApprenantDetailPage.jsx
import {
  useLoaderData,
  Form,
  useNavigation,
  useActionData,
  Link,
  useFetcher,
} from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "./ApprenantDetailPage.css";

export default function ApprenantDetailPage() {
  const apprenant = useLoaderData();
  const navigation = useNavigation();
  const actionData = useActionData();
  const deleteFetcher = useFetcher();
  const isUpdating = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
  }, [actionData]);

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb">
        <Link to="/apprenants" className="back-link">
          ← Apprenants
        </Link>
      </div>

      <div className="detail-layout">
        {/* Carte de profil */}
        <div className="profile-card">
          <div
            className="profile-avatar"
            style={{ background: apprenant.color }}
          >
            {apprenant.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <h2 className="profile-name">{apprenant.name}</h2>
          <p className="profile-age">{apprenant.age} ans</p>
          <div className="profile-color-chip">
            <div
              className="color-dot"
              style={{ background: apprenant.color }}
            />
            <span>{apprenant.color}</span>
          </div>
          <div className="profile-meta">
            <span className="meta-label">ID</span>
            <span className="meta-value">#{apprenant.id}</span>
          </div>

          {/* Delete */}
          <deleteFetcher.Form
            method="post"
            action={`/apprenants/${apprenant.id}/delete`}
            onSubmit={(e) => {
              if (!confirm("Supprimer définitivement ?")) e.preventDefault();
            }}
          >
            <button
              type="submit"
              className="btn btn-danger btn-delete"
              disabled={deleteFetcher.state === "submitting"}
            >
              {deleteFetcher.state === "submitting"
                ? "Suppression…"
                : "🗑️ Supprimer"}
            </button>
          </deleteFetcher.Form>
        </div>

        {/* Formulaire de modification */}
        <div className="edit-panel">
          <h3 className="edit-title">Modifier l'apprenant</h3>
          <Form method="post" className="edit-form">
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                className="input"
                id="name"
                name="name"
                type="text"
                defaultValue={apprenant.name}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Âge</label>
              <input
                className="input"
                id="age"
                name="age"
                type="number"
                defaultValue={apprenant.age}
                min={0}
                max={120}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="color">Couleur</label>
              <input
                className="input"
                id="color"
                name="color"
                type="color"
                defaultValue={apprenant.color}
              />
            </div>
            <div className="edit-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? "Enregistrement…" : "💾 Enregistrer"}
              </button>
              <Link to="/apprenants" className="btn btn-ghost">
                Annuler
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
