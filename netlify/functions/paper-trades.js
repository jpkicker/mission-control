const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async () => {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };

  try {
    // Fetch recent trades (last 50)
    const tradesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/paper_trades?order=created_at.desc&limit=50`,
      { headers }
    );

    if (!tradesRes.ok) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'table_not_ready', trades: [], stats: null }),
      };
    }

    const trades = await tradesRes.json();

    // Compute stats from resolved trades
    const resolved = trades.filter(t => t.resolved);
    const wins = resolved.filter(t => t.pnl_usdc > 0);
    const totalPnl = resolved.reduce((sum, t) => sum + (t.pnl_usdc || 0), 0);
    const winRate = resolved.length > 0 ? (wins.length / resolved.length * 100).toFixed(1) : null;
    const openTrades = trades.filter(t => !t.resolved);

    const stats = {
      total_trades: trades.length,
      resolved: resolved.length,
      open: openTrades.length,
      wins: wins.length,
      win_rate: winRate,
      total_pnl: totalPnl.toFixed(2),
      fake_usdc_deployed: trades.reduce((sum, t) => sum + (t.fake_usdc_risked || 0), 0).toFixed(2),
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ trades, stats }),
    };
  } catch (e) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message, trades: [], stats: null }),
    };
  }
};
