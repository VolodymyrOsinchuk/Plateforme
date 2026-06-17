const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const handler = async () => {
  if (!SUPABASE_URL) {
    return {
      statusCode: 500,
      body: "Erreur : SUPABASE_URL ou VITE_SUPABASE_URL n'est pas défini.",
    };
  }

  try {
    const response = await fetch(SUPABASE_URL, { method: "HEAD" });
    return {
      statusCode: response.status,
      body: `Ping Supabase OK : ${response.status}`,
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: `Échec du ping Supabase : ${error.message}`,
    };
  }
};
