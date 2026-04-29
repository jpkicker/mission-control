const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  const today = event.queryStringParameters?.date || new Date().toISOString().split('T')[0];

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/mc_food_log?date=eq.${today}&order=created_at.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );

  if (!res.ok) return { statusCode: res.status, headers, body: JSON.stringify({ error: 'Supabase error' }) };

  const rows = await res.json();
  return { statusCode: 200, headers, body: JSON.stringify(rows) };
};
