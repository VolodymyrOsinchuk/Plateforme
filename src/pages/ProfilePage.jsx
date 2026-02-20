// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || "",
  );
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profil mis à jour !");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Minimum 6 caractères");
      return;
    }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPw(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Mot de passe modifié !");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "⚠️ Supprimer définitivement votre compte ? Cette action est irréversible.",
      )
    )
      return;
    await logout();
    toast.info("Compte supprimé. À bientôt !");
    navigate("/login");
  };

  const initials = (user?.user_metadata?.full_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Mon profil</h1>
          <p className="page-subtitle">
            Gérez vos informations personnelles et votre sécurité
          </p>
        </div>
      </header>

      <div className="profile-layout">
        {/* Carte identité */}
        <div className="identity-card">
          <div className="identity-avatar">{initials}</div>
          <div className="identity-name">
            {user?.user_metadata?.full_name || "—"}
          </div>
          <div className="identity-email">{user?.email}</div>
          <div className="identity-provider">
            {user?.app_metadata?.provider === "google"
              ? "🔗 Compte Google"
              : "📧 Email / Mot de passe"}
          </div>
        </div>

        <div className="profile-sections">
          {/* Infos générales */}
          <section className="profile-section">
            <h2 className="section-heading">Informations générales</h2>
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  className="input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="input"
                  type="email"
                  value={user?.email || ""}
                  disabled
                />
                <small className="field-hint">
                  L'email ne peut pas être modifié ici.
                </small>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Enregistrement…" : "💾 Enregistrer"}
              </button>
            </form>
          </section>

          {/* Changer le mot de passe — masqué pour les comptes OAuth */}
          {user?.app_metadata?.provider !== "google" && (
            <section className="profile-section">
              <h2 className="section-heading">Changer le mot de passe</h2>
              <form className="profile-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>
                    Nouveau mot de passe <span className="hint">(6 min.)</span>
                  </label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={changingPw}
                >
                  {changingPw ? "Mise à jour…" : "🔐 Modifier le mot de passe"}
                </button>
              </form>
            </section>
          )}

          {/* Zone danger */}
          <section className="profile-section danger-zone">
            <h2 className="section-heading danger-heading">
              ⚠️ Zone de danger
            </h2>
            <p className="danger-desc">
              La déconnexion vous ramènera à la page de connexion. La
              suppression de compte est définitive.
            </p>
            <div className="danger-actions">
              <button
                className="btn btn-ghost"
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
              >
                🚪 Se déconnecter
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                🗑️ Supprimer mon compte
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
