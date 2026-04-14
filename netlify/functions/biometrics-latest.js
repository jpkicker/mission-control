const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/mc_biometrics?order=date.desc&limit=1`,
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
    body: JSON.stringify(rows[0] || null),
  };
};
