export async function onRequest(context) {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return new Response(
      JSON.stringify({ error: "Missing symbol parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const pair = symbol.toUpperCase().replace("USDT", "");
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${pair}&tsyms=USD`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("CryptoCompare API error");

    const data = await res.json();

    if (!data.USD) {
      throw new Error("Invalid symbol");
    }

    return new Response(
      JSON.stringify({
        symbol: symbol.toUpperCase(),
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

