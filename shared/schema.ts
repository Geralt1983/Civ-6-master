import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  gameSpeed: text("game_speed"),
  turn: integer("turn").notNull(),
  era: text("era").notNull(),
  leader: text("leader").notNull(),
  yields: jsonb("yields").notNull().$type<{
    science: number;
    culture: number;
    faith: number;
    gold: number;
    production: number;
    food: number;
  }>(),
  currentResearch: jsonb("current_research").$type<{
    name: string;
    turnsLeft: number;
    progress: number;
    icon?: string;
  }>(),
  currentCivic: jsonb("current_civic").$type<{
    name: string;
    turnsLeft: number;
    progress: number;
    icon?: string;
  }>(),
  alerts: jsonb("alerts").$type<Array<{
    id: number;
    type: 'danger' | 'opportunity' | 'info';
    message: string;
    details: string;
  }>>(),
  recommendations: jsonb("recommendations").$type<Array<{
    id: number;
    category: 'city' | 'unit' | 'tech' | 'civic';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
  updatedAt: true,
});

export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type GameState = typeof gameStates.$inferSelect;
