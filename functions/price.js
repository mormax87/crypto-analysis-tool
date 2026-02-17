export async function onRequest(context) {
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get("symbol");

  if (!symbol) {
    return new Response(
      JSON.stringify({ error: "Missing symbol parameter" }),
      { status: 400 }
    );
  }

  const upperSymbol = symbol.toUpperCase();

  // 1️⃣ Binance Spot
  try {
    const r = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${upperSymbol}`,
      { cf: { cacheTtl: 0 } }
    );
    if (r.ok) {
      const d = await r.json();
      return jsonResponse({
        symbol: upperSymbol,
        price: d.price,
        source: "Binance Spot",
        timestamp_utc: new Date().toISOString()
      });
    }
  } catch {}

  // 2️⃣ CoinGecko
  try {
    const base = upperSymbol.replace("USDT", "").toLowerCase();
    const r = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=usd`,
      { cf: { cacheTtl: 0 } }
    );
    if (r.ok) {
      const d = await r.json();
      if (d[base]?.usd) {
        return jsonResponse({
          symbol: upperSymbol,
          price: d[base].usd.toString(),
          source: "CoinGecko",
          timestamp_utc: new Date().toISOString()
        });
      }
    }
  } catch {}

  // 3️⃣ CoinCap
  try {
    const base = upperSymbol.replace("USDT", "").toLowerCase();
    const r = await fetch(`https://api.coincap.io/v2/assets/${base}`);
    if (r.ok) {
      const d = await r.json();
      if (d.data?.priceUsd) {
        return jsonResponse({
          symbol: upperSymbol,
          price: Number(d.data.priceUsd).toFixed(2),
          source: "CoinCap",
          timestamp_utc: new Date().toISOString()
        });
      }
    }
  } catch {}

  return jsonResponse({
    error: "Live market data unavailable. Analysis cannot be generated."
  }, 503);
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
