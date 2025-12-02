import { db } from "./db";
import { gameStates, type InsertGameState, type GameState } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  upsertGameState(state: InsertGameState): Promise<GameState>;
  getLatestGameState(): Promise<GameState | undefined>;
}

export class DatabaseStorage implements IStorage {
  async upsertGameState(state: InsertGameState): Promise<GameState> {
    const [result] = await db.insert(gameStates).values([state]).returning();
    return result;
  }

  async getLatestGameState(): Promise<GameState | undefined> {
    const [result] = await db
      .select()
      .from(gameStates)
      .orderBy(desc(gameStates.updatedAt))
      .limit(1);
    return result;
  }
}

export const storage = new DatabaseStorage();
