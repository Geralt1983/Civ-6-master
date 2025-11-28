export const BENCHMARKS = [
  {
    turn: 30,
    metrics: { science: 15, culture: 20, production: 15 },
    advice: "Turn 30 (Online Speed): You should have a Government Plaza and your first district. Aim for Classical Republic."
  },
  {
    turn: 50,
    metrics: { science: 50, culture: 60, production: 30 },
    advice: "Turn 50 (Online Speed): 2+ districts in all cities. Prepare for Industrialization. Ensure Serfdom is active."
  },
  {
    turn: 70,
    metrics: { science: 100, culture: 120, production: 50 },
    advice: "Turn 70 (Online Speed): Chemistry Tech should be near. PRIORITIZE RESEARCH LABS. Ignore wonders/military until Labs are done."
  },
  {
    turn: 100,
    metrics: { science: 250, culture: 200, production: 80 },
    advice: "Turn 100 (Online Speed): Rocketry (Science) or Tanks (Domination) should be unlocked."
  }
];

export const CIV_STRATEGIES: Record<string, {
  name: string;
  focus: string;
  keyTechs: string[];
  keyCivics: string[];
  tips: string[];
}> = {
  "TRAJAN": {
    name: "Rome (Trajan)",
    focus: "Domination/Expansion",
    keyTechs: ["Iron Working", "Engineering"],
    keyCivics: ["Political Philosophy", "Civil Service"],
    tips: [
      "Build Commercial Hubs early. Use free monuments to rush Feudalism.",
      "Power Spike: Medieval Era with Legions. Build roads to enemy borders.",
      "Standard expansion: Scout -> Scout -> Settler -> Settler."
    ]
  },
  "GERMANY": {
    name: "Germany (Frederick)",
    focus: "Production/Science",
    keyTechs: ["Apprenticeship", "Industrialization"],
    keyCivics: ["Guilds"],
    tips: [
      "HANSA PLANNING: Place Hansas next to Commercial Hubs (+2 adj).",
      "Do not ignore culture; you specifically need the 'Guilds' civic for the extra district slot.",
      "Scale into late game; you can support 1-2 more districts per city than anyone else."
    ]
  },
  "VICTORIA": {
    name: "England (Victoria)",
    focus: "Naval/Science",
    keyTechs: ["Celestial Navigation", "Industrialization"],
    keyCivics: ["Naval Tradition"],
    tips: [
      "RUSH Royal Navy Dockyards. They are cheap and give gold/trade.",
      "Mid-Game: Use 'Free Inquiry' Golden Age + 'Naval Infrastructure' card to turn Harbor adjacency into massive Science.",
      "Strategic Resource mines get +1 production."
    ]
  },
  "JADWIGA": {
    name: "Poland (Jadwiga)",
    focus: "Religion/Relics",
    keyTechs: ["Astrology"],
    keyCivics: ["Divine Right"],
    tips: [
      "RELIC RUSH: Found religion ASAP to get a free Relic. Use 'Reliquaries' belief to triple yields.",
      "Use Culture bombs from Encampments/Forts to steal land.",
      "Gold from Relics helps fund expansion."
    ]
  },
  "PERICLES": {
    name: "Greece (Pericles)",
    focus: "Culture",
    keyTechs: ["Printing"],
    keyCivics: ["Drama and Poetry", "Opera_Ballet"],
    tips: [
      "ACROPOLIS: Must be on Hills. Spam them for easy envoys.",
      "Suzerainty King: +5% Culture per city-state you control. Prioritize Amani governor.",
      "Culture Victory: Get to 'Cultural Heritage' civic for the tourism boost."
    ]
  },
  "GANDHI": {
    name: "India (Gandhi)",
    focus: "Religion/Peace",
    keyTechs: ["Astrology", "Education"],
    keyCivics: ["Theology", "Reformed Church"],
    tips: [
      "FAITH ECONOMY: Use Stepwells for food+faith. Rush a religion.",
      "Peaceful: +5 faith per civ met who founded a religion and is not at war.",
      "Build Holy Sites in every city. Use Theocracy government for faith-bought units."
    ]
  },
  "CLEOPATRA": {
    name: "Egypt (Cleopatra)",
    focus: "Wonder/Trade",
    keyTechs: ["Masonry", "Bronze Working"],
    keyCivics: ["Foreign Trade", "Early Empire"],
    tips: [
      "WONDER RUSH: +15% production to wonders on rivers. Prioritize Pyramids.",
      "Trade routes to allies give +4 gold. Build Commercial Hubs for extra routes.",
      "Sphinxes give culture and faith; place next to wonders for bonus."
    ]
  },
  "MONTEZUMA": {
    name: "Aztec (Montezuma)",
    focus: "Domination/Builders",
    keyTechs: ["Bronze Working", "Iron Working"],
    keyCivics: ["Military Tradition"],
    tips: [
      "EAGLE WARRIORS: Convert enemies to builders early. Rush 3-4 builders from combat.",
      "Luxury bonus: +1 combat strength per luxury. Collect them all.",
      "Build districts fast using captured builders. Aggressive early expansion wins games."
    ]
  },
  "PETER": {
    name: "Russia (Peter)",
    focus: "Religion/Culture",
    keyTechs: ["Astrology", "Writing"],
    keyCivics: ["Early Empire", "Theology"],
    tips: [
      "LAVRA: +1 Great Prophet point and territory expansion. Build in every city.",
      "Tundra bonus: Extra faith and production from tundra tiles.",
      "Trade with advanced civs for bonus science and culture. Stay behind intentionally early."
    ]
  },
  "FREDERICK": {
    name: "Germany (Frederick)",
    focus: "Production/Science",
    keyTechs: ["Apprenticeship", "Industrialization"],
    keyCivics: ["Guilds"],
    tips: [
      "HANSA PLANNING: Place Hansas next to Commercial Hubs (+2 adj).",
      "Do not ignore culture; you specifically need the 'Guilds' civic for the extra district slot.",
      "Scale into late game; you can support 1-2 more districts per city than anyone else."
    ]
  }
};

export interface GeneralAdviceRule {
  condition: (state: any) => boolean;
  type: string;
  title: string;
  desc: string;
}

export const GENERAL_ADVICE: GeneralAdviceRule[] = [
  {
    condition: (state: any) => state.turn > 35 && state.turn < 50 && !state.currentCivic?.name?.includes("Feudalism"),
    type: "civic",
    title: "RUSH FEUDALISM",
    desc: "Approaching mid-game. Feudalism unlocks Serfdom (+2 Builder Charges). This is the most important economic spike."
  },
  {
    condition: (state: any) => state.turn > 60 && state.yields.science < 80,
    type: "tech",
    title: "Low Science Warning",
    desc: "You are falling behind benchmarks. Build Campuses/Libraries or prepare to pillage Campuses."
  },
  {
    condition: (state: any) => state.turn > 90 && !state.currentResearch?.name?.includes("Combustion"),
    type: "tech",
    title: "Modern War Prep",
    desc: "Late game domination requires Tanks (Combustion). Start pre-building Cuirassiers to upgrade them cheaply."
  },
  {
    condition: (state: any) => state.turn < 20 && state.yields.production < 10,
    type: "city",
    title: "Early Production Focus",
    desc: "Low early production. Prioritize mining hills and chopping forests for critical early builds."
  },
  {
    condition: (state: any) => state.turn > 40 && state.turn < 70 && state.yields.gold < 30,
    type: "city",
    title: "Gold Economy Warning",
    desc: "Low gold income limits army maintenance and building purchases. Build Commercial Hubs or Harbors."
  },
  {
    condition: (state: any) => state.turn > 80 && state.yields.culture < 100,
    type: "civic",
    title: "Culture Deficit",
    desc: "Low culture slows government/policy progression. Build Theater Squares or run cultural city projects."
  }
];
