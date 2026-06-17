import { schedule } from "@netlify/functions";

// Toutes les 6 heures, largement suffisant pour rester sous les 7 jours d'inactivité
export const handler = schedule("0 */6 * * *", async () => {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

  if (!SUPABASE_URL) {
    console.error("VITE_SUPABASE_URL n'est pas défini.");
    return {
      statusCode: 500,
      body: "Erreur : VITE_SUPABASE_URL n'est pas défini dans les variables d'environnement Netlify.",
    };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: process.env.VITE_SUPABASE_ANON_KEY || "",
      },
    });

    console.log(`Ping Supabase OK : ${response.status}`);
    return {
      statusCode: 200,
      body: `Ping Supabase OK : ${response.status}`,
    };
  } catch (error) {
    console.error(`Échec du ping Supabase : ${error.message}`);
    return {
      statusCode: 502,
      body: `Échec du ping Supabase : ${error.message}`,
    };
  }
});
