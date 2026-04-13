const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const AGENT_META = {
  milo: { name: 'Milo', emoji: '🧠', color: '#6366f1' },
  devon: { name: 'Devon', emoji: '💻', color: '#10b981' },
  baxter: { name: 'Baxter', emoji: '🏠', color: '#f59e0b' },
  vida: { name: 'Vida', emoji: '💚', color: '#22c55e' },
  ivy: { name: 'Ivy', emoji: '✉️', color: '#f97316' },
  system: { name: 'System', emoji: '⚙️', color: '#64748b' },
};

exports.handler = async (event) => {
  const limit = event.queryStringParameters?.limit || 50;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/mc_activity?order=created_at.desc&limit=${limit}`,
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

  const normalized = rows.map((r) => {
    const meta = AGENT_META[r.agent_id] || AGENT_META.system;
    return {
      id: r.id,
      agent_id: r.agent_id,
      agent_name: meta.name,
      agent_emoji: meta.emoji,
      agent_color: meta.color,
      type: r.type,
      message: r.message,
      metadata: r.metadata,
      created_at: r.created_at,
    };
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(normalized),
  };
};
