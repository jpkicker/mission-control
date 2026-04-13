const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async (event) => {
  const days = event.queryStringParameters?.days || 30;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/mc_biometrics?order=recorded_at.asc&recorded_at=gte.${since}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!res.ok) {
    return { statusCode: res.status, body: JSON.stringify({ error: 'Supabase error' }) };
  }

  const rows = await res.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(rows),
  };
};
