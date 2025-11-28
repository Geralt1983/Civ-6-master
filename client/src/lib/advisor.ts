import { BENCHMARKS, CIV_STRATEGIES, GENERAL_ADVICE } from "./strategyDb";

export interface GameStateForAdvisor {
  gameSpeed?: string;
  turn: number;
  era: string;
  leader: string;
  yields: {
    science: number;
    culture: number;
    faith: number;
    gold: number;
    production: number;
    food: number;
  };
  currentResearch?: {
    name: string;
    turnsLeft: number;
    progress: number;
    icon?: string;
  };
  currentCivic?: {
    name: string;
    turnsLeft: number;
    progress: number;
    icon?: string;
  };
}

const SPEED_MULTIPLIERS: Record<string, number> = {
  "GAMESPEED_ONLINE": 1,
  "GAMESPEED_QUICK": 1.33,
  "GAMESPEED_STANDARD": 2,
  "GAMESPEED_EPIC": 3,
  "GAMESPEED_MARATHON": 6
};

export interface Recommendation {
  id: number;
  category: 'city' | 'unit' | 'tech' | 'civic';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function generateRecommendations(state: GameStateForAdvisor): Recommendation[] {
  const recs: Recommendation[] = [];
  let idCounter = 1;

  const multiplier = state.gameSpeed ? (SPEED_MULTIPLIERS[state.gameSpeed] || 1) : 1;
  const normalizedTurn = state.turn / multiplier;

  const benchmark = BENCHMARKS.find(b => 
    normalizedTurn >= b.turn - 5 && normalizedTurn <= b.turn + 5
  );
  
  if (benchmark) {
    const scaledScience = benchmark.metrics.science * multiplier;
    const scaledCulture = benchmark.metrics.culture * multiplier;
    
    if (state.yields.science < scaledScience) {
      recs.push({
        id: idCounter++,
        category: 'city',
        title: `Science Lagging (Turn ${state.turn})`,
        description: `Target: ${Math.round(scaledScience)} science/turn. ${benchmark.advice}`,
        priority: 'high'
      });
    }
    if (state.yields.culture < scaledCulture) {
      recs.push({
        id: idCounter++,
        category: 'civic',
        title: `Culture Lagging (Turn ${state.turn})`,
        description: `Target: ${Math.round(scaledCulture)} culture/turn. Vital for government unlocks.`,
        priority: 'high'
      });
    }
  }

  const leaderUpper = state.leader.toUpperCase();
  const civKey = Object.keys(CIV_STRATEGIES).find(key => {
    const strat = CIV_STRATEGIES[key];
    return leaderUpper.includes(key) || 
           leaderUpper.includes(strat.name.split(" ")[0].toUpperCase()) ||
           strat.name.toUpperCase().includes(leaderUpper.split(" ")[0]);
  });

  if (civKey) {
    const strat = CIV_STRATEGIES[civKey];
    if (strat.keyTechs.length > 0) {
      recs.push({
        id: idCounter++,
        category: 'tech',
        title: `${strat.name} Tech Path`,
        description: `Focus: ${strat.focus}. Prioritize: ${strat.keyTechs.join(", ")}.`,
        priority: 'medium'
      });
    }
    const tipIndex = Math.floor(normalizedTurn / 20) % strat.tips.length;
    recs.push({
      id: idCounter++,
      category: 'city',
      title: `${strat.name} Strategy`,
      description: strat.tips[tipIndex],
      priority: 'low'
    });
  }

  GENERAL_ADVICE.forEach(rule => {
    const virtualState = { 
      ...state, 
      turn: normalizedTurn,
      yields: {
        ...state.yields,
        science: state.yields.science / multiplier,
        culture: state.yields.culture / multiplier,
        gold: state.yields.gold / multiplier,
        production: state.yields.production / multiplier
      }
    };
    
    if (rule.condition(virtualState)) {
      recs.push({
        id: idCounter++,
        category: rule.type as any,
        title: rule.title,
        description: rule.desc,
        priority: 'high'
      });
    }
  });

  return recs;
}
