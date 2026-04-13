const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async () => {
  // Pull handoffs from Supabase mc_handoffs table if it exists,
  // otherwise return empty array gracefully
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/mc_handoffs?order=created_at.desc&limit=20`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify([]),
      };
    }

    const rows = await res.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(rows),
    };
  } catch {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify([]),
    };
  }
};
