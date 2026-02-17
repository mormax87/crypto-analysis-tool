import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ⚠️ لا fallback
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تقديم ملفات الموقع
app.use(express.static(__dirname));

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log("Server running on Railway on port", PORT);
});
