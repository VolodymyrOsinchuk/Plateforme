// src/pages/ResetPasswordPage.jsx
import { useState, useEffect } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import "./AuthPage.css";
import "./ResetPasswordPage.css";

// ── Ce composant gère deux états :
//    1. L'utilisateur saisit son email → reçoit un lien
//    2. L'utilisateur arrive via le lien → saisit un nouveau mot de passe

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Supabase place le token dans le hash lors du redirect
  const [hasSession, setHasSession] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
    if (actionData?.success) toast.success(actionData.success);
  }, [actionData]);

  // Détecter si on arrive via le lien de reset (session temporaire)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHasSession(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setHasSession(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Minimum 6 caractères");
      return;
    }

    setUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdating(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Mot de passe mis à jour !");
      window.location.href = "/";
    }
  };

  // ── Étape 2 : nouveau mot de passe ──────────────────────────────────────
  if (hasSession) {
    return (
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Nouveau mot de passe</h2>
          <p>Choisissez un mot de passe sécurisé</p>
        </div>

        <form className="auth-form" onSubmit={handleUpdatePassword} noValidate>
          <div className="form-group">
            <label htmlFor="newPassword">
              Nouveau mot de passe <span className="hint">(6 min.)</span>
            </label>
            <input
              className="input"
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirmer</label>
            <input
              className="input"
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={updating}
          >
            {updating ? "Mise à jour…" : "Mettre à jour"}
          </button>
        </form>
      </div>
    );
  }

  // ── Étape 1 : demande de lien par email ─────────────────────────────────
  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h2>Mot de passe oublié</h2>
        <p>Entrez votre email pour recevoir un lien de réinitialisation</p>
      </div>

      <Form method="post" className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            name="email"
            type="email"
            placeholder="vous@example.com"
            required
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi…" : "Envoyer le lien"}
        </button>
      </Form>

      <p className="auth-footer-text">
        <Link to="/login">← Retour à la connexion</Link>
      </p>
    </div>
  );
}
