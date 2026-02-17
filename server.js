import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تقديم ملفات الموقع (HTML / CSS / JS)
app.use(express.static(__dirname));

/* =========================
   Health Check
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =========================
   PRICE ENDPOINT
   /price?symbol=BTCUSDT
========================= */
app.get("/price", async (req, res) => {
  const symbol = req.query.symbol?.toUpperCase();

  if (!symbol) {
    return res.status(400).json({
      error: "Missing symbol parameter"
    });
  }

  // 1️⃣ Binance (primary)
  try {
    const binanceRes = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );

    if (binanceRes.ok) {
      const data = await binanceRes.json();
      return res.json({
        symbol: data.symbol,
        price: data.price,
        source: "Binance Spot",
        timestamp_utc: new Date().toISOString()
      });
    }
  } catch (e) {}

  // 2️⃣ CoinGecko (fallback)
  try {
    const base = symbol.replace("USDT", "").toLowerCase();
    const geckoRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=usd`
    );

    if (geckoRes.ok) {
      const data = await geckoRes.json();
      if (data[base]?.usd) {
        return res.json({
          symbol: symbol,
          price: data[base].usd,
          source: "CoinGecko",
          timestamp_utc: new Date().toISOString()
        });
      }
    }
  } catch (e) {}

  // ❌ All sources failed
  res.status(503).json({
    error: "Live market data unavailable",
    reason: "All data sources failed"
  });
});

/* ========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
