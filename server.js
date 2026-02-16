import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تقديم ملفات الموقع
app.use(express.static(__dirname));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Root test
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
