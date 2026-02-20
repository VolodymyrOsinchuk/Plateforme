// src/router/index.jsx
import { createBrowserRouter, redirect } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  fetchApprenants,
  fetchApprenant,
  createApprenant,
  updateApprenant,
  deleteApprenant,
} from "../api/apprenants";

import RootLayout from "../components/Layout/RootLayout";
import AuthLayout from "../components/Layout/AuthLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ApprenantsPage from "../pages/ApprenantsPage";
import ApprenantsDetailPage from "../pages/ApprenantDetailPage";
import ErrorPage from "../pages/ErrorPage";
import ProfilePage from "../pages/ProfilePage";

// ── Guard : redirige vers /login si pas de session ──────────────────────────
async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw redirect("/login");
  return session;
}

// ── Guard : redirige vers / si déjà connecté ───────────────────────────────
async function requireGuest() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) throw redirect("/");
  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// LOADERS
// ──────────────────────────────────────────────────────────────────────────────
async function apprenantsLoader() {
  await requireAuth();
  return fetchApprenants();
}

async function apprenantDetailLoader({ params }) {
  await requireAuth();
  return fetchApprenant(params.id);
}

// ──────────────────────────────────────────────────────────────────────────────
// ACTIONS
// ──────────────────────────────────────────────────────────────────────────────
async function loginAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  throw redirect("/");
}

async function registerAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };
  return { success: "Vérifiez votre email pour confirmer votre compte." };
}

async function createApprenantAction({ request }) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw redirect("/login");

  const formData = await request.formData();
  const name = formData.get("name");
  const age = Number(formData.get("age"));
  const color = formData.get("color");

  try {
    await createApprenant({ user_id: session.user.id, name, age, color });
    throw redirect("/apprenants");
  } catch (err) {
    if (err instanceof Response) throw err;
    return { error: err.message };
  }
}

async function updateApprenantAction({ request, params }) {
  await requireAuth();
  const formData = await request.formData();
  const name = formData.get("name");
  const age = Number(formData.get("age"));
  const color = formData.get("color");

  try {
    await updateApprenant(params.id, { name, age, color });
    throw redirect("/apprenants");
  } catch (err) {
    if (err instanceof Response) throw err;
    return { error: err.message };
  }
}

async function deleteApprenantAction({ params }) {
  await requireAuth();
  await deleteApprenant(params.id);
  throw redirect("/apprenants");
}

// ──────────────────────────────────────────────────────────────────────────────
// ROUTER
// ──────────────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // Routes protégées
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        loader: async () => {
          await requireAuth();
          return null;
        },
      },
      {
        path: "apprenants",
        element: <ApprenantsPage />,
        loader: apprenantsLoader,
        action: createApprenantAction,
      },
      {
        path: "apprenants/:id",
        element: <ApprenantsDetailPage />,
        loader: apprenantDetailLoader,
        action: updateApprenantAction,
      },
      {
        path: "apprenants/:id/delete",
        action: deleteApprenantAction,
      },
      {
        path: "profil",
        element: <ProfilePage />,
      },
    ],
  },
  // Routes publiques
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        loader: requireGuest,
        action: loginAction,
      },
      {
        path: "/register",
        element: <RegisterPage />,
        loader: requireGuest,
        action: registerAction,
      },
    ],
  },
]);

export default router;
