// src/components/User/ApprenantCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ApprenantCard.css";

export default function ApprenantCard({ apprenant, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(apprenant.name);
  const [age, setAge] = useState(apprenant.age);
  const [color, setColor] = useState(apprenant.color);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ name, age: Number(age), color });
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(apprenant.name);
    setAge(apprenant.age);
    setColor(apprenant.color);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="apprenant-card editing">
        <div className="card-edit-body">
          <div className="form-group">
            <label>Nom</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="card-row">
            <div className="form-group">
              <label>Âge</label>
              <input
                className="input"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={0}
                max={120}
              />
            </div>
            <div className="form-group">
              <label>Couleur</label>
              <input
                className="input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "…" : "💾 Enregistrer"}
          </button>
          <button className="btn btn-ghost" onClick={handleCancel}>
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apprenant-card" style={{ "--card-color": apprenant.color }}>
      <div className="card-accent" />
      <div className="card-body">
        <div className="card-top">
          <div className="card-avatar" style={{ background: apprenant.color }}>
            {apprenant.name?.[0]?.toUpperCase()}
          </div>
          <div className="card-badge">{apprenant.age} ans</div>
        </div>
        <div className="card-name">{apprenant.name}</div>
        <div className="card-id">#{apprenant.id}</div>
      </div>
      <div className="card-actions">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onUpdate({ age: apprenant.age + 1 })}
        >
          🎂 +1 an
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setIsEditing(true)}
        >
          ✏️
        </button>
        <Link
          to={`/apprenants/${apprenant.id}`}
          className="btn btn-ghost btn-sm"
        >
          →
        </Link>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          🗑️
        </button>
      </div>
    </div>
  );
}
