import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// price endpoint
app.get("/price", async (req, res) => {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol parameter" });
  }

  try {
    // تحويل BTCUSDT → bitcoin
    const map = {
      BTCUSDT: "bitcoin",
      ETHUSDT: "ethereum",
      SOLUSDT: "solana"
    };

    const coinId = map[symbol.toUpperCase()];
    if (!coinId) {
      return res.status(400).json({ error: "Unsupported symbol" });
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "crypto-analysis-tool"
      }
    });

    if (!response.ok) {
      throw new Error("CoinGecko API error");
    }

    const data = await response.json();

    res.json({
      symbol: symbol.toUpperCase(),
      price_usd: data[coinId].usd,
      source: "CoinGecko",
      timestamp_utc: new Date().toISOString()
    });

  } catch (err) {
    res.status(500).json({
      error: "Live market data unavailable",
      reason: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
