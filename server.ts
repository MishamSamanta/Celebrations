import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "1") {
    return null;
  }
  return new Stripe(key);
};

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
    virtual_gift TEXT,
    physical_gifts TEXT, -- JSON string array
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS premium_requests (
    id TEXT PRIMARY KEY,
    user_email TEXT,
    suggestions TEXT,
    deadline TEXT,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'unpaid',
    stripe_session_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add virtual_gift column if it doesn't exist
try {
  const columns = db.prepare("PRAGMA table_info(surprises)").all();
  const hasVirtualGift = columns.some((col: any) => col.name === 'virtual_gift');
  if (!hasVirtualGift) {
    db.exec("ALTER TABLE surprises ADD COLUMN virtual_gift TEXT");
    console.log("Migration: Added virtual_gift column to surprises table");
  }
  const hasPhysicalGifts = columns.some((col: any) => col.name === 'physical_gifts');
  if (!hasPhysicalGifts) {
    db.exec("ALTER TABLE surprises ADD COLUMN physical_gifts TEXT");
    console.log("Migration: Added physical_gifts column to surprises table");
  }
} catch (error) {
  console.error("Migration error:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Stripe Checkout
  app.post("/api/create-checkout-session", async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured. Please set a valid STRIPE_SECRET_KEY in environment variables." });
    }

    const { email } = req.body;
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Premium Custom Surprise Website",
                description: "A fully custom, professionally built surprise website with your specific requirements and deadline.",
              },
              unit_amount: 4900, // $49.00
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/premium`,
        customer_email: email,
      });

      res.json({ id: session.id });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Save Premium Request
  app.post("/api/premium-requests", (req, res) => {
    const { sessionId, suggestions, deadline, email } = req.body;

    try {
      const stmt = db.prepare(`
        INSERT INTO premium_requests (id, user_email, suggestions, deadline, payment_status, stripe_session_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const id = Math.random().toString(36).substring(2, 15);
      stmt.run(id, email, suggestions, deadline, 'paid', sessionId);

      res.json({ success: true, id });
    } catch (error) {
      console.error("Error saving premium request:", error);
      res.status(500).json({ error: "Failed to save request" });
    }
  });

  // API Routes
  app.get("/api/config", (req, res) => {
    res.json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
    });
  });

  app.post("/api/surprises", (req, res) => {
    const {
      id, senderName, receiverName, relationship, occasion, message, memories,
      photos, videos, voiceMessage, music, theme, openingText,
      finalWish, password, unlockTime, oneTimeReveal, virtualGift, physicalGifts
    } = req.body;

    try {
      const stmt = db.prepare(`
        INSERT INTO surprises (
          id, sender_name, receiver_name, relationship, occasion, message, memories,
          photos, videos, voice_message, music, theme, opening_text,
          final_wish, password, unlock_time, one_time_reveal, virtual_gift, physical_gifts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id, senderName, receiverName, relationship, occasion, message, memories,
        JSON.stringify(photos || []), JSON.stringify(videos || []),
        voiceMessage, music, theme, openingText,
        finalWish, password, unlockTime, oneTimeReveal ? 1 : 0, virtualGift,
        JSON.stringify(physicalGifts || [])
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
      oneTimeReveal: !!surprise.one_time_reveal,
      virtualGift: surprise.virtual_gift,
      physicalGifts: JSON.parse(surprise.physical_gifts || '[]')
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
