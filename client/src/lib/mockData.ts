export interface Yields {
  science: number;
  culture: number;
  faith: number;
  gold: number;
  production: number;
  food: number;
}

export interface GameState {
  gameSpeed?: string;
  turn: number;
  era: string;
  leader: string;
  yields: Yields;
  currentResearch: {
    name: string;
    turnsLeft: number;
    progress: number;
    icon?: string;
  };
  currentCivic: {
    name: string;
    turnsLeft: number;
    progress: number;
    icon?: string;
  };
  alerts?: Array<{
    id: number;
    type: 'danger' | 'opportunity' | 'info';
    message: string;
    details: string;
  }>;
  recommendations?: Array<{
    id: number;
    category: 'city' | 'unit' | 'tech' | 'civic';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export const mockGameState: GameState = {
  turn: 142,
  era: 'Medieval Era',
  leader: 'Trajan (Rome)',
  yields: {
    science: 84.5,
    culture: 62.3,
    faith: 12.0,
    gold: 45.2,
    production: 112,
    food: 89
  },
  currentResearch: {
    name: 'Apprenticeship',
    turnsLeft: 3,
    progress: 75,
    icon: 'flask'
  },
  currentCivic: {
    name: 'Feudalism',
    turnsLeft: 5,
    progress: 40,
    icon: 'scroll'
  },
  alerts: [
    {
      id: 1,
      type: 'danger',
      message: 'Barbarian Horseman Detected',
      details: '3 tiles north of Rome. Suggest moving Legion to intercept.'
    },
    {
      id: 2,
      type: 'opportunity',
      message: 'Optimal Campus Location',
      details: '+4 Science adjacency found near Antium (Mountain/Reef).'
    }
  ],
  recommendations: [
    {
      id: 1,
      category: 'city',
      title: 'Build Industrial Zone',
      description: 'Rome has high adjacency potential (+5) next to Aqueduct.',
      priority: 'high'
    },
    {
      id: 2,
      category: 'tech',
      title: 'Boost: Machinery',
      description: 'Build 3 Archers to boost Machinery research.',
      priority: 'medium'
    },
    {
      id: 3,
      category: 'unit',
      title: 'Settler Escort',
      description: 'Unescorted Settler moving towards dangerous fog of war.',
      priority: 'high'
    }
  ]
};
