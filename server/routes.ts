import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameStateSchema } from "@shared/schema";

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

  return httpServer;
}
