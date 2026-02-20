// src/pages/ApprenantsPage.jsx
import {
  useLoaderData,
  Form,
  useNavigation,
  useActionData,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import {
  QUERY_KEY,
  useDeleteApprenant,
  useUpdateApprenant,
} from "../hooks/useApprenants";
import ApprenantCard from "../components/User/ApprenantCard";
import "./ApprenantsPage.css";

export default function ApprenantsPage() {
  const initialApprenants = useLoaderData();
  const [apprenants, setApprenants] = useState(initialApprenants);
  const navigation = useNavigation();
  const actionData = useActionData();
  const queryClient = useQueryClient();
  const isCreating = navigation.state === "submitting";

  const [showForm, setShowForm] = useState(false);

  const { mutateAsync: remove } = useDeleteApprenant();
  const { mutateAsync: update } = useUpdateApprenant();

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
    if (navigation.state === "idle" && navigation.formMethod === "post") {
      toast.success("Apprenant ajouté !");
      setShowForm(false);
    }
  }, [actionData, navigation]);

  // Sync loader data changes
  useEffect(() => {
    setApprenants(initialApprenants);
  }, [initialApprenants]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("apprenants_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "apprenants" },
        () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [queryClient]);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet apprenant ?")) return;
    try {
      await remove(id);
      setApprenants((prev) => prev.filter((a) => a.id !== id));
      toast.success("Apprenant supprimé");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const updated = await update({ id, ...payload });
      setApprenants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...payload } : a)),
      );
      toast.success("Apprenant mis à jour");
      return updated;
    } catch (e) {
      toast.error(e.message);
    }
  };

  const randomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

  return (
    <div className="apprenants-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Apprenants</h1>
          <p className="page-subtitle">
            {apprenants.length} apprenant{apprenants.length !== 1 ? "s" : ""}{" "}
            enregistré{apprenants.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Annuler" : "＋ Nouvel apprenant"}
        </button>
      </header>

      {showForm && (
        <Form method="post" className="create-form">
          <h3 className="form-title">Créer un apprenant</h3>
          <div className="create-form-grid">
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                className="input"
                id="name"
                name="name"
                type="text"
                placeholder="Prénom Nom"
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
                defaultValue={20}
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
                defaultValue={randomColor()}
              />
            </div>
          </div>
          <div className="create-form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreating}
            >
              {isCreating ? "Création…" : "Créer"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </button>
          </div>
        </Form>
      )}

      {apprenants.length === 0 ? (
        <div className="empty-state">
          <span>👥</span>
          <p>Aucun apprenant pour l'instant</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Créer le premier
          </button>
        </div>
      ) : (
        <div className="apprenants-grid">
          {apprenants.map((a) => (
            <ApprenantCard
              key={a.id}
              apprenant={a}
              onDelete={() => handleDelete(a.id)}
              onUpdate={(payload) => handleUpdate(a.id, payload)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
