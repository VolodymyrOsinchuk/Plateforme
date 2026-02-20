// src/App.jsx
//
// Dans la nouvelle architecture, App.jsx est un simple wrapper.
// Toute la logique d'auth, de données et de navigation est gérée par :
//   - src/router/index.jsx  → createBrowserRouter, loaders, actions, guards
//   - src/hooks/useAuth.js  → session Supabase réactive
//   - src/hooks/useApprenants.js → React Query (cache, mutations)
//   - src/api/axiosClient.js → instance Axios avec JWT auto-injecté
//
// Plus besoin de gérer session/users/CRUD ici.

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 min avant refetch automatique
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {/* Notifications globales */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />

      {/* Devtools React Query (visible uniquement en dev) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
