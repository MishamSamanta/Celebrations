import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("surprises.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS surprises (
    id TEXT PRIMARY KEY,
    sender_name TEXT,
    receiver_name TEXT,
    relationship TEXT,
    occasion TEXT,
    message TEXT,
    memories TEXT,
    photos TEXT, -- JSON string array
    videos TEXT, -- JSON string array
    voice_message TEXT,
    music TEXT,
    theme TEXT,
    opening_text TEXT,
    final_wish TEXT,
    password TEXT,
    unlock_time TEXT,
    one_time_reveal INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/surprises", (req, res) => {
    const {
      id, senderName, receiverName, relationship, occasion, message, memories,
      photos, videos, voiceMessage, music, theme, openingText,
      finalWish, password, unlockTime, oneTimeReveal
    } = req.body;

    try {
      const stmt = db.prepare(`
        INSERT INTO surprises (
          id, sender_name, receiver_name, relationship, occasion, message, memories,
          photos, videos, voice_message, music, theme, opening_text,
          final_wish, password, unlock_time, one_time_reveal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id, senderName, receiverName, relationship, occasion, message, memories,
        JSON.stringify(photos || []), JSON.stringify(videos || []),
        voiceMessage, music, theme, openingText,
        finalWish, password, unlockTime, oneTimeReveal ? 1 : 0
      );

      res.json({ success: true, id });
    } catch (error) {
      console.error("Error creating surprise:", error);
      res.status(500).json({ error: "Failed to create surprise" });
    }
  });

  app.get("/api/surprises/:id", (req, res) => {
    const { id } = req.params;
    const surprise = db.prepare("SELECT * FROM surprises WHERE id = ?").get(id);

    if (!surprise) {
      return res.status(404).json({ error: "Surprise not found" });
    }

    // Increment view count
    db.prepare("UPDATE surprises SET view_count = view_count + 1 WHERE id = ?").run(id);

    res.json({
      ...surprise,
      photos: JSON.parse(surprise.photos),
      videos: JSON.parse(surprise.videos),
      oneTimeReveal: !!surprise.one_time_reveal
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
