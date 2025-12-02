import { type GameState } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getGameState(): Promise<GameState | undefined>;
  updateGameState(state: GameState): Promise<GameState>;
}

export class MemStorage implements IStorage {
  private currentState: GameState | undefined;

  constructor() {
    this.currentState = undefined;
  }

  async getGameState(): Promise<GameState | undefined> {
    return this.currentState;
  }

  async updateGameState(state: GameState): Promise<GameState> {
    this.currentState = state;
    return state;
  }
}

export const storage = new MemStorage();
