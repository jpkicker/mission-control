const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const TARGETS = { fat: { min: 70, max: 75 }, protein: { min: 20, max: 25 }, carb: { min: 4, max: 6 } };

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  const today = event.queryStringParameters?.date || new Date().toISOString().split('T')[0];

  try {
    const foodRes = await fetch(
      `${SUPABASE_URL}/rest/v1/mc_food_log?date=eq.${today}&order=created_at.asc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const foods = await foodRes.json();

    if (!foods.length) {
      return { statusCode: 200, headers, body: JSON.stringify({ empty: true, fat_pct: 0, protein_pct: 0, carb_pct: 0, total_calories: 0, targets: TARGETS }) };
    }

    const foodList = foods.map((f, i) =>
      `${i + 1}. ${f.food_item}${f.gross_carbs != null ? ` (${f.gross_carbs}g carbs logged)` : ''}`
    ).join('\n');

    const prompt = `You are a nutritionist estimating macronutrients for keto diet foods. For each food item below, estimate fat_g, protein_g, carb_g, and calories. Use the logged carb count if provided (it overrides your estimate for carbs). Account for serving sizes mentioned in the description.

Return ONLY a valid JSON array — no markdown, no explanation. Each element: {"fat_g": number, "protein_g": number, "carb_g": number, "calories": number}

Food items:
${foodList}`;

    const llmRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const llmData = await llmRes.json();
    const text = llmData?.content?.[0]?.text || '[]';

    let estimates = [];
    try {
      const match = text.match(/\[[\s\S]*\]/);
      estimates = JSON.parse(match ? match[0] : text);
    } catch { estimates = []; }

    let totalFat = 0, totalProtein = 0, totalCarb = 0, totalCal = 0;
    estimates.forEach(e => {
      totalFat += Number(e.fat_g) || 0;
      totalProtein += Number(e.protein_g) || 0;
      totalCarb += Number(e.carb_g) || 0;
      totalCal += Number(e.calories) || 0;
    });

    // Calorie contribution by macro
    const fatCal = totalFat * 9;
    const proteinCal = totalProtein * 4;
    const carbCal = totalCarb * 4;
    const macroTotal = fatCal + proteinCal + carbCal || 1;

    const fat_pct = Math.round(fatCal / macroTotal * 100);
    const protein_pct = Math.round(proteinCal / macroTotal * 100);
    const carb_pct = 100 - fat_pct - protein_pct;

    const items = foods.map((f, i) => ({ ...f, ...(estimates[i] || {}) }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ fat_pct, protein_pct, carb_pct, total_calories: Math.round(totalCal), items, targets: TARGETS }),
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
