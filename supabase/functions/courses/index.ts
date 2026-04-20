// Supabase Edge Function: courses
// This proxies course list requests to the edrona API from the server side,

// EDRONA_BASE_URL is stored as a Supabase Secret
const EDRONA_BASE_URL = Deno.env.get("EDRONA_BASE_URL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle preflight CORS requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!EDRONA_BASE_URL) {
      return new Response(
        JSON.stringify({ error: "EDRONA_BASE_URL secret is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);

    const edronaUrl = new URL("/api/ritz7ai/courses/filter-courses", EDRONA_BASE_URL);

    url.searchParams.forEach((value, key) => {
      edronaUrl.searchParams.append(key, value);
    });

    const response = await fetch(edronaUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch courses from upstream API", status: response.status }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
