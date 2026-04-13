import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// CACHE
// =======================
let cachedPlayers = [];
let lastUpdate = 0;

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.send("✅ SERVER OK");
});

// =======================
// ROBLOX PUSH
// =======================
app.post("/update-players", (req, res) => {
  console.log("🔥 ROBLOX LLEGÓ:");
  console.log(JSON.stringify(req.body, null, 2));

  const players = req.body?.players;

  if (!Array.isArray(players)) {
    return res.status(400).json({ ok: false });
  }

  cachedPlayers = players;
  lastUpdate = Date.now();

  console.log(`✅ Players: ${players.length}`);

  res.json({ ok: true, count: players.length });
});

// =======================
// FRONTEND
// =======================
app.get("/players", (req, res) => {
  res.json({
    players: cachedPlayers,
    count: cachedPlayers.length,
    age_ms: Date.now() - lastUpdate,
    source: cachedPlayers.length ? "live" : "none",
  });
});

// =======================
// COMMANDS
// =======================
app.post("/command", (req, res) => {
  console.log("📩 COMMAND:", req.body);
  res.json({ ok: true });
});

// =======================
// LISTEN
// =======================
app.listen(3000, "0.0.0.0", () => {
  console.log("⚡ SERVER RUNNING http://192.168.0.1:3000"); 
});