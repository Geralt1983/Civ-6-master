import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStateSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // WebSocket for real-time updates
  wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    
    // Send latest state on connection
    storage.getLatestGameState().then((state) => {
      if (state) {
        ws.send(JSON.stringify({ type: "gamestate", data: state }));
      }
    });
  });

  // POST /api/gamestate - Receive game state from bridge
  app.post("/api/gamestate", async (req, res) => {
    try {
      const validatedData = insertGameStateSchema.parse(req.body);
      const savedState = await storage.upsertGameState(validatedData);
      
      // Broadcast to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "gamestate", data: savedState }));
        }
      });
      
      res.json(savedState);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error saving game state:", error);
      res.status(500).json({ error: "Failed to save game state" });
    }
  });

  // GET /api/gamestate - Get latest game state
  app.get("/api/gamestate", async (req, res) => {
    try {
      const state = await storage.getLatestGameState();
      if (!state) {
        return res.status(404).json({ error: "No game state found" });
      }
      res.json(state);
    } catch (error) {
      console.error("Error fetching game state:", error);
      res.status(500).json({ error: "Failed to fetch game state" });
    }
  });

  return httpServer;
}
