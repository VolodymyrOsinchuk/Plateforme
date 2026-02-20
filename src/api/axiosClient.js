// src/api/axiosClient.js
import axios from "axios";
import { supabase } from "../supabaseClient";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
});

// Intercepteur : injecte le JWT de la session active avant chaque requête
axiosClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// Intercepteur réponse : gestion centralisée des erreurs
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.hint ||
      "Une erreur est survenue";
    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
