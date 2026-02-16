export async function onRequest(context) {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  let symbol = searchParams.get("symbol");

  if (!symbol) {
    return new Response(
      JSON.stringify({ error: "Missing symbol parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // تنظيف الإدخال
  symbol = symbol.trim().toUpperCase();

  // دعم أزواج USDT فقط حاليًا
  if (!symbol.endsWith("USDT")) {
    return new Response(
      JSON.stringify({ error: "Only USDT pairs are supported" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const baseSymbol = symbol.replace("USDT", "");

  const url = `https://min-api.cryptocompare.com/data/price?fsym=${baseSymbol}&tsyms=USD`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.USD) {
      throw new Error("Invalid symbol");
    }

    return new Response(
      JSON.stringify({
        symbol: symbol,
        price_usd: data.USD,
        source: "CryptoCompare (public)",
        timestamp_utc: new Date().toISOString()
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch live data",
        details: err.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
