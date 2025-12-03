import { z } from "zod";

export const gameStateSchema = z.object({
  gameSpeed: z.string().optional(),
  turn: z.number(),
  era: z.string(),
  leader: z.string(),
  yields: z.object({
    science: z.number(),
    culture: z.number(),
    faith: z.number(),
    gold: z.number(),
    production: z.number(),
    food: z.number(),
  }),
  cities: z.array(z.object({
    name: z.string(),
    pop: z.number(),
    producing: z.string(),
  })).optional(),
  army: z.record(z.string(), z.number()).optional(),
  currentResearch: z.object({
    name: z.string(),
    turnsLeft: z.number(),
    progress: z.number(),
    icon: z.string().optional(),
  }).optional(),
  currentCivic: z.object({
    name: z.string(),
    turnsLeft: z.number(),
    progress: z.number(),
    icon: z.string().optional(),
  }).optional(),
  alerts: z.array(z.object({
    id: z.number(),
    type: z.enum(['danger', 'opportunity', 'info']),
    message: z.string(),
    details: z.string(),
  })).optional(),
  recommendations: z.array(z.object({
    id: z.number(),
    category: z.enum(['city', 'unit', 'tech', 'civic']),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
  })).optional(),
});

export type GameState = z.infer<typeof gameStateSchema>;

export type User = any;
export type InsertUser = any;
