import { type GameState } from "@shared/schema";

export interface IStorage {
  getGameState(): Promise<GameState | undefined>;
  updateGameState(state: GameState): Promise<GameState>;
  getHistory(): Promise<GameState[]>;
}

export class MemStorage implements IStorage {
  private currentState: GameState | undefined;
  private history: GameState[] = [];

  constructor() {
    this.currentState = undefined;
  }

  async getGameState(): Promise<GameState | undefined> {
    return this.currentState;
  }

  async updateGameState(state: GameState): Promise<GameState> {
    this.currentState = state;
    this.history.push(state);
    if (this.history.length > 50) this.history.shift();
    return state;
  }

  async getHistory(): Promise<GameState[]> {
    return this.history;
  }
}

export const storage = new MemStorage();
