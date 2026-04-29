const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smamtkqlkuqkztorjemr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Free USDA FoodData Central API (DEMO_KEY = 50 req/day, sufficient for personal use)
const USDA_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const USDA_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

const TARGETS = { fat: { min: 70, max: 75 }, protein: { min: 20, max: 25 }, carb: { min: 4, max: 6 } };

// Calorie density fallbacks by keyword category (kcal per gram)
const FALLBACKS = [
  { keys: ['oil','butter','lard','ghee','cream cheese','mayo','avocado'], fat: 85, protein: 2, carb: 3, kcal_g: 7.5 },
  { keys: ['cream','half and half','heavy'], fat: 80, protein: 5, carb: 5, kcal_g: 3.2 },
  { keys: ['bacon','pork belly'], fat: 70, protein: 30, carb: 0, kcal_g: 4.5 },
  { keys: ['beef','steak','brisket','prime rib','rib','burger','ground beef','roast'], fat: 60, protein: 40, carb: 0, kcal_g: 2.5 },
  { keys: ['salmon','tuna','mackerel','sardine'], fat: 50, protein: 50, carb: 0, kcal_g: 2.0 },
  { keys: ['chicken thigh','chicken wing','duck'], fat: 55, protein: 45, carb: 0, kcal_g: 2.0 },
  { keys: ['chicken breast','chicken','turkey breast','turkey'], fat: 20, protein: 80, carb: 0, kcal_g: 1.6 },
  { keys: ['egg','eggs'], fat: 65, protein: 35, carb: 0, kcal_g: 1.5 },
  { keys: ['cheese','cheddar','parmesan','mozzarella','brie','gouda'], fat: 70, protein: 25, carb: 5, kcal_g: 4.0 },
  { keys: ['nuts','almonds','walnuts','pecans','macadamia'], fat: 78, protein: 12, carb: 10, kcal_g: 6.5 },
  { keys: ['broccoli','spinach','cauliflower','kale','lettuce','salad','asparagus','zucchini','cabbage'], fat: 8, protein: 20, carb: 72, kcal_g: 0.35 },
  { keys: ['coffee','tea'], fat: 0, protein: 0, carb: 0, kcal_g: 0 },
];

function parsePortion(text) {
  // Extract weight in grams; handles "oz", "g", "lb", "cup" approximations
  const lower = text.toLowerCase();
  const ozMatch = lower.match(/(\d+(?:\.\d+)?)\s*oz/);
  const gMatch = lower.match(/(\d+(?:\.\d+)?)\s*g\b/);
  const lbMatch = lower.match(/(\d+(?:\.\d+)?)\s*lb/);
  if (ozMatch) return parseFloat(ozMatch[1]) * 28.35;
  if (lbMatch) return parseFloat(lbMatch[1]) * 453.6;
  if (gMatch) return parseFloat(gMatch[1]);
  return 150; // default portion ~150g
}

function fallbackEstimate(text, portionG, knownCarbG) {
  const lower = text.toLowerCase();
  for (const cat of FALLBACKS) {
    if (cat.keys.some(k => lower.includes(k))) {
      const calories = portionG * cat.kcal_g;
      // Derive grams from calorie-based percentages; override carbs if known
      const carbG = knownCarbG != null ? knownCarbG : (calories * (cat.carb / 100)) / 4;
      const fatG = (calories * (cat.fat / 100)) / 9;
      const proteinG = (calories * (cat.protein / 100)) / 4;
      return { fat_g: fatG, protein_g: proteinG, carb_g: carbG, calories };
    }
  }
  // Generic: assume moderate fat/protein if unknown
  const calories = portionG * 1.5;
  return { fat_g: calories * 0.5 / 9, protein_g: calories * 0.3 / 4, carb_g: knownCarbG != null ? knownCarbG : calories * 0.2 / 4, calories };
}

async function usdaLookup(query, portionG, knownCarbG) {
  try {
    const url = `${USDA_URL}?query=${encodeURIComponent(query)}&pageSize=1&api_key=${USDA_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const food = data.foods?.[0];
    if (!food) return null;

    const get = (name) => {
      const n = food.foodNutrients?.find(n => n.nutrientName === name);
      return n?.value || 0;
    };

    // USDA values are per 100g
    const scale = portionG / 100;
    const fat_g = get('Total lipid (fat)') * scale;
    const protein_g = get('Protein') * scale;
    const carb_g = knownCarbG != null ? knownCarbG : get('Carbohydrate, by difference') * scale;
    const calories = get('Energy') * scale || (fat_g * 9 + protein_g * 4 + carb_g * 4);
    return { fat_g, protein_g, carb_g, calories };
  } catch {
    return null;
  }
}

function extractSearchTerm(text) {
  // Strip quantities, cooking descriptors, modifiers to get main ingredient
  return text
    .replace(/\d+(\.\d+)?\s*(oz|g|lb|cup|tbsp|tsp|piece|slice|serving|can|fl oz)\b/gi, '')
    .replace(/\b(with|and|au|jus|sauce|dressing|side|of|a|the|some|small|medium|large|grilled|baked|fried|roasted|steamed|raw|light|heavy|whole|boneless|skinless)\b/gi, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .slice(0, 50);
}

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

    const items = await Promise.all(foods.map(async (f) => {
      const portionG = parsePortion(f.food_item);
      const searchTerm = extractSearchTerm(f.food_item);
      const knownCarbG = f.gross_carbs != null ? Number(f.gross_carbs) : null;

      // Try USDA first, fall back to category estimate
      let macros = await usdaLookup(searchTerm, portionG, knownCarbG);
      if (!macros) macros = fallbackEstimate(f.food_item, portionG, knownCarbG);

      return { ...f, ...macros };
    }));

    let totalFat = 0, totalProtein = 0, totalCarb = 0, totalCal = 0;
    items.forEach(i => {
      totalFat += i.fat_g || 0;
      totalProtein += i.protein_g || 0;
      totalCarb += i.carb_g || 0;
      totalCal += i.calories || 0;
    });

    const fatCal = totalFat * 9;
    const proteinCal = totalProtein * 4;
    const carbCal = totalCarb * 4;
    const macroTotal = fatCal + proteinCal + carbCal || 1;

    const fat_pct = Math.round(fatCal / macroTotal * 100);
    const protein_pct = Math.round(proteinCal / macroTotal * 100);
    const carb_pct = 100 - fat_pct - protein_pct;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ fat_pct, protein_pct, carb_pct, total_calories: Math.round(totalCal), items, targets: TARGETS }),
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
