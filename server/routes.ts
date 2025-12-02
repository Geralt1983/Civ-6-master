import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameStateSchema } from "@shared/schema";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // 1. RECEIVE DATA (From your PC)
  app.post("/api/gamestate", async (req, res) => {
    console.log("📥 Receiving Game State from Bridge...");
    
    // Parse the incoming data to make sure it's valid
    const result = gameStateSchema.safeParse(req.body);
    if (!result.success) {
      console.error("❌ Invalid Data:", result.error);
      return res.status(400).json({ error: "Invalid game state data" });
    }
    
    // Save to Memory
    const updated = await storage.updateGameState(result.data);
    console.log(`✅ Game State Updated: Turn ${updated.turn} (${updated.leader})`);
    res.json(updated);
  });

  // 2. SEND DATA (To your Dashboard)
  app.get("/api/gamestate", async (req, res) => {
    const state = await storage.getGameState();
    if (!state) {
      return res.status(404).json({ message: "No active game state found" });
    }
    res.json(state);
  });

  // 3. AI COACH ENDPOINT - Strategos
  app.post("/api/ask-strategos", async (req, res) => {
    try {
      const gameState = req.body;
      console.log("🧠 Strategos analyzing game state...");

      // Load the System Prompt
      const promptPath = path.join(process.cwd(), "server", "strategos_prompt.md");
      const systemPrompt = fs.readFileSync(promptPath, "utf-8");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Using gpt-4o for best reasoning on strategy
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(gameState) }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content || "{}";
      const advice = JSON.parse(content);
      console.log("✅ Strategos analysis complete:", advice.grade);
      res.json(advice);

    } catch (error: any) {
      console.error("❌ AI Error:", error.message || error);
      res.status(500).json({ error: "Strategos is offline (AI Error)", details: error.message });
    }
  });

  return httpServer;
}
