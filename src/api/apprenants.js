// src/api/apprenants.js
import axiosClient from "./axiosClient";

const TABLE = "/apprenants";

// ── READ ────────────────────────────────────────────────────────────────────
export async function fetchApprenants() {
  const { data } = await axiosClient.get(`${TABLE}?order=id.asc`);
  return data;
}

export async function fetchApprenant(id) {
  const { data } = await axiosClient.get(`${TABLE}?id=eq.${id}&select=*`);
  if (!data.length) throw new Error("Apprenant introuvable");
  return data[0];
}

// ── CREATE ──────────────────────────────────────────────────────────────────
export async function createApprenant(payload) {
  const { data } = await axiosClient.post(TABLE, payload);
  return data[0];
}

// ── UPDATE ──────────────────────────────────────────────────────────────────
export async function updateApprenant(id, payload) {
  const { data } = await axiosClient.patch(`${TABLE}?id=eq.${id}`, payload);
  return data[0];
}

// ── DELETE ──────────────────────────────────────────────────────────────────
export async function deleteApprenant(id) {
  await axiosClient.delete(`${TABLE}?id=eq.${id}`);
  return true;
}
