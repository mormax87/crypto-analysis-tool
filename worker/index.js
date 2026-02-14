export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pairsParam = url.searchParams.get("pairs");

    if (!pairsParam) {
      return new Response("No pairs provided", { status: 400 });
    }

    const pairs = pairsParam.split(",").map(p => p.trim().toUpperCase());

    let output = "LIVE MARKET DATA\n\n";

    for (const pair of pairs) {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`
        );

        if (!res.ok) throw new Error("Source unavailable");

        const data = await res.json();

        const time = new Date().toISOString().slice(11, 16);

        output += `Asset: ${pair}\n`;
        output += `Live Price: ${data.price}\n`;
        output += `Source: Binance Spot\n`;
        output += `UTC Time: ${time}\n\n`;
      } catch (e) {
        output += `Asset: ${pair}\n`;
        output += `Live market data unavailable. Analysis cannot be generated.\n\n`;
      }
    }

    return new Response(output, {
      headers: { "Content-Type": "text/plain" }
    });
  }
};

