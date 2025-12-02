import { GameState } from "@shared/schema";
import { BENCHMARKS, CIV_STRATEGIES, GENERAL_ADVICE } from "./strategyDb";

const SPEED_MULTIPLIERS: Record<string, number> = {
  "GAMESPEED_ONLINE": 1,
  "GAMESPEED_QUICK": 1.33,
  "GAMESPEED_STANDARD": 2,
  "GAMESPEED_EPIC": 3,
  "GAMESPEED_MARATHON": 6
};

export interface AdvisorResult {
  alerts: any[];
  recommendations: any[];
}

export function generateAdvice(state: GameState): AdvisorResult {
  const alerts: any[] = [];
  const recommendations: any[] = [];
  let idCounter = 1;

  const multiplier = state.gameSpeed ? (SPEED_MULTIPLIERS[state.gameSpeed] || 1) : 1;
  const normalizedTurn = state.turn / multiplier;

  const benchmark = BENCHMARKS.find(b => 
    normalizedTurn >= b.turn - 5 && normalizedTurn <= b.turn + 5
  );
  
  if (benchmark) {
    if (state.yields.science < benchmark.metrics.science) {
      alerts.push({
        id: idCounter++,
        type: 'danger',
        message: `Science Critical (Turn ${state.turn})`,
        details: `Current: ${state.yields.science}. Target: ${benchmark.metrics.science}. ${benchmark.advice}`
      });
    }
    if (state.yields.culture < benchmark.metrics.culture) {
      alerts.push({
        id: idCounter++,
        type: 'danger',
        message: `Culture Critical (Turn ${state.turn})`,
        details: `Current: ${state.yields.culture}. Target: ${benchmark.metrics.culture}. Vital for government unlocks.`
      });
    }
  }

  GENERAL_ADVICE.forEach(rule => {
    const virtualState = { ...state, turn: normalizedTurn };
    try {
      if (rule.condition(virtualState)) {
        alerts.push({
          id: idCounter++,
          type: 'opportunity',
          message: rule.title,
          details: rule.desc
        });
      }
    } catch (e) {
    }
  });

  const civKey = Object.keys(CIV_STRATEGIES).find(key => 
    state.leader.toUpperCase().includes(key) || 
    state.leader.toUpperCase().includes(CIV_STRATEGIES[key].name.toUpperCase().split(" ")[0])
  );

  if (civKey) {
    const strat = CIV_STRATEGIES[civKey];
    
    if (strat.keyTechs.length > 0) {
      recommendations.push({
        id: idCounter++,
        category: 'tech',
        title: `${strat.name} Tech Path`,
        description: `Prioritize: ${strat.keyTechs.join(", ")}.`,
        priority: 'high'
      });
    }

    if (strat.keyCivics.length > 0) {
      recommendations.push({
        id: idCounter++,
        category: 'civic',
        title: `${strat.name} Civic Path`,
        description: `Target: ${strat.keyCivics.join(", ")}.`,
        priority: 'medium'
      });
    }

    const randomTip = strat.tips[state.turn % strat.tips.length]; 
    recommendations.push({
      id: idCounter++,
      category: 'city',
      title: `${strat.name} Strategy`,
      description: randomTip,
      priority: 'medium'
    });
  }

  return { alerts, recommendations };
}
