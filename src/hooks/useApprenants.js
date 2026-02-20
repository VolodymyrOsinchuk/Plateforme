// src/hooks/useApprenants.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchApprenants,
  fetchApprenant,
  createApprenant,
  updateApprenant,
  deleteApprenant,
} from "../api/apprenants";

export const QUERY_KEY = ["apprenants"];

// ── Lire tous les apprenants ────────────────────────────────────────────────
export function useApprenants() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchApprenants,
  });
}

// ── Lire un apprenant ───────────────────────────────────────────────────────
export function useApprenant(id) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchApprenant(id),
    enabled: !!id,
  });
}

// ── Créer ───────────────────────────────────────────────────────────────────
export function useCreateApprenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApprenant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

// ── Modifier ────────────────────────────────────────────────────────────────
export function useUpdateApprenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateApprenant(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

// ── Supprimer ────────────────────────────────────────────────────────────────
export function useDeleteApprenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApprenant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
