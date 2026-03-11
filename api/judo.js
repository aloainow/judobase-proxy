const BASE_URL = "https://data.ijf.org/api/get_json";

// Cache em memória (Vercel Edge Functions mantêm entre requests por um tempo)
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hora em ms

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (!action) {
    return new Response(
      JSON.stringify({ error: "Missing 'action' parameter" }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Build params for IJF API
  const params = new URLSearchParams();
  params.set("params[action]", action);

  // Forward all other params
  for (const [key, value] of url.searchParams.entries()) {
    if (key !== "action") {
      params.set(`params[${key}]`, value);
    }
  }

  // Check cache
  const cacheKey = params.toString();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return new Response(JSON.stringify(cached.data), {
      status: 200,
      headers: { ...corsHeaders, "X-Cache": "HIT" },
    });
  }

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": "TimeBrasilIntelligence/1.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `IJF API returned ${response.status}` }),
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();

    // Store in cache
    cache.set(cacheKey, { data, time: Date.now() });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "X-Cache": "MISS" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from IJF API", detail: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
