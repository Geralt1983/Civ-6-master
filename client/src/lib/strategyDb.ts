// client/src/lib/strategyDb.ts

// --- SECTION 1: TURN BENCHMARKS (Baseline: ONLINE SPEED) ---
// The Advisor engine will automatically scale your current turn to match these numbers.
export const BENCHMARKS = [
  {
    turn: 30,
    metrics: { science: 15, culture: 40, production: 15 },
    advice: "Turn 30 Goal: 5 cities settled (Standard) or 2-3 tall cities. You need Monuments built. Avoid Campuses unless you are a pure Science Civ."
  },
  {
    turn: 45,
    metrics: { science: 40, culture: 45, production: 25 },
    advice: "Feudalism Check: You MUST have unlocked Feudalism by now for the Serfdom policy (+2 Builder Charges). Produce a wave of Builders now."
  },
  {
    turn: 50,
    metrics: { science: 100, culture: 100, production: 40 },
    advice: "Mid-Game Transition: 8-10 cities settled. Universities and Workshops should be completing. Prepare for a Free Inquiry Golden Age if naval."
  },
  {
    turn: 60,
    metrics: { science: 200, culture: 150, production: 60 },
    advice: "Golden Age Spike: You should be in a Golden Age (Free Inquiry or Monumentality). Your yields should be exploding."
  },
  {
    turn: 70,
    metrics: { science: 300, culture: 300, production: 100 },
    advice: "Industrial Power: PRIORITIZE RESEARCH LABS (Chemistry). Complete 1 tech/turn. Unlock Tier 3 Governments (Fascism/Democracy)."
  },
  {
    turn: 100,
    metrics: { science: 1000, culture: 800, production: 200 },
    advice: "Endgame: Launch Space Projects or finalize Tourism multipliers (Computers/Environmentalism). Field Modern Armor/Atomic armies."
  }
];

// --- SECTION 2: OPENING BUILD ORDER ---
export const OPENING_BUILD_ORDER = [
  { turn: 1, item: "Scout", reason: "Standard opener for Era Score (2 scouts needed)." },
  { turn: 5, item: "Scout", reason: "Find City States and Natural Wonders ASAP." },
  { turn: 10, item: "Settler", reason: "Start expanding. Target 3-4 cities by Turn 30." },
  { turn: 15, item: "Settler", reason: "Continue expansion. Pre-place districts to lock costs." },
];

// --- SECTION 3: GENERAL ADVICE RULES ---
export interface GeneralAdviceRule {
  condition: (state: any) => boolean;
  type: string;
  title: string;
  desc: string;
}

export const GENERAL_ADVICE: GeneralAdviceRule[] = [
  {
    condition: (state: any) => state.turn < 30 && state.yields.science > state.yields.culture && state.currentResearch?.name?.includes("Writing"),
    type: "city",
    title: "Stop Building Campuses",
    desc: "Unless you are Korea/Maya, Science scales poorly early. Prioritize Monuments and Culture to reach Feudalism."
  },
  {
    condition: (state: any) => state.turn > 40 && !state.currentCivic?.name?.includes("Feudalism") && state.yields.culture < 45,
    type: "civic",
    title: "RUSH FEUDALISM",
    desc: "You are missing the Serfdom power spike (5-charge Builders). Focus all efforts on Culture."
  },
  {
    condition: (state: any) => state.turn > 55 && state.yields.science < 200,
    type: "tech",
    title: "Missed Medieval Spike",
    desc: "You missed the Turn 60 benchmark (200 Science). If Naval, check Harbor adjacency + Free Inquiry. If Land, pillage to catch up."
  },
  {
    condition: (state: any) => state.turn > 75 && !state.currentResearch?.name?.includes("Combustion") && !state.currentResearch?.name?.includes("Chemistry"),
    type: "tech",
    title: "Late Industrial Lag",
    desc: "You need Chemistry (Labs) or Combustion (Tanks) immediately. Do not research filler techs."
  },
  {
    condition: (state: any) => state.yields.gold < 0,
    type: "city",
    title: "Bankruptcy Warning",
    desc: "Your treasury is shrinking. Delete outdated units or run 'Commercial Hub Investment' projects."
  },
  {
    condition: (state: any) => state.turn > 80 && state.yields.culture < 100,
    type: "civic",
    title: "Culture Deficit",
    desc: "Low culture slows government/policy progression. Build Theater Squares or run cultural city projects."
  }
];

// --- SECTION 4: CIVILIZATION STRATEGIES (Extracted from YouTube) ---
export const CIV_STRATEGIES: Record<string, {
  name: string;
  focus: string;
  keyTechs: string[];
  keyCivics: string[];
  tips: string[];
}> = {
  // AMERICAS
  "TEDDY": {
    name: "America (Bull Moose)",
    focus: "Culture",
    keyTechs: ["Flight", "Radio", "Computers"],
    keyCivics: ["Mysticism", "Conservation", "Environmentalism"],
    tips: [
      "Prioritize Earth Goddess Pantheon and Preserves early; settle to maximize Appeal.",
      "Use Builders to plant Woods (Medieval Fairs) to boost Appeal to 'Breathtaking'.",
      "Rush Film Studio and Computers for massive Tourism multipliers."
    ]
  },
  "ROUGH_RIDER": {
    name: "America (Rough Rider)",
    focus: "Domination/Culture",
    keyTechs: ["Rifling", "Conservation"],
    keyCivics: ["Nationalism", "Conservation"],
    tips: [
      "+5 Combat Strength on home continent.",
      "Film Studios give massive tourism late game.",
      "National Parks are key; build lots of Naturalists."
    ]
  },
  "MONTEZUMA": {
    name: "Aztec",
    focus: "Domination/Science",
    keyTechs: ["Mining", "Irrigation", "Industrialization"],
    keyCivics: ["Early Empire", "Feudalism", "Nationalism"],
    tips: [
      "Farm city-state units with Eagle Warriors to convert them into free Builders.",
      "Settle extremely wide (10+ cities); Tlachtli and luxuries provide Amenities.",
      "Prioritize settling different luxury resources to stack combat strength bonuses."
    ]
  },
  "POUNDMAKER": {
    name: "Cree",
    focus: "Science/Sim",
    keyTechs: ["Animal Husbandry", "Industrialization", "Chemistry"],
    keyCivics: ["Early Empire", "Civil Service", "Diplomatic Service"],
    tips: [
      "Use Okihtcitaw scout for high combat strength and early Era Score.",
      "Send internal trade routes to cities with Pastures/Camps to maximize food.",
      "Build Mekewaps on plains/hills for Production and Housing."
    ]
  },
  "PACHACUTI": {
    name: "Inca",
    focus: "Science/Sim",
    keyTechs: ["Mining", "Engineering", "Industrialization"],
    keyCivics: ["Code of Laws", "Feudalism", "Globalization"],
    tips: [
      "Open with a Builder to construct Terrace Farms immediately.",
      "Ignore amenity penalties; cities grow and remain productive regardless.",
      "Use Mountain Tunnels (Qhapaq Nan) early to boost trade efficiency."
    ]
  },
  "LADY_SIX_SKY": {
    name: "Maya",
    focus: "Tall Science",
    keyTechs: ["Masonry", "Ballistics"],
    keyCivics: ["Mercenaries"],
    tips: [
      "Settle cities within 6 tiles of capital for +10% yields.",
      "Do not settle near fresh water; rely on Farms/Aqueducts.",
      "Observatories get adjacency from Farms/Plantations."
    ]
  },
  "WILFRID": {
    name: "Canada",
    focus: "Diplo/Culture",
    keyTechs: ["Conservation"],
    keyCivics: ["Diplomatic Service"],
    tips: [
      "Cannot declare Surprise Wars.",
      "Tundra farms work like normal farms.",
      "Build Ice Hockey Rinks for appeal/culture."
    ]
  },
  "PEDRO": {
    name: "Brazil",
    focus: "Culture/Science",
    keyTechs: ["Construction", "Ballistics", "Industrialization"],
    keyCivics: ["Drama and Poetry", "Mercantilism", "Natural History"],
    tips: [
      "Rush Street Carnivals to run the Carnival project for Great Person points.",
      "Use Free Inquiry Golden Age + Rainforest Commercial Hubs for science.",
      "Rush Ballistics for +1 production on Lumber Mills (Rainforest)."
    ]
  },
  "SIMON": {
    name: "Gran Colombia",
    focus: "Domination",
    keyTechs: ["Military Science"],
    keyCivics: ["Mercenaries"],
    tips: [
      "+1 Movement to ALL units is broken; use it to pillage and retreat.",
      "Promote units and move/attack in the same turn.",
      "Comandante Generals give unique passive buffs; stack them."
    ]
  },

  // EUROPE
  "TRAJAN": {
    name: "Rome (Trajan)",
    focus: "Domination/Expansion",
    keyTechs: ["Iron Working", "Engineering"],
    keyCivics: ["Political Philosophy", "Civil Service"],
    tips: [
      "Free Monuments mean fast culture; rush Feudalism.",
      "Legions can chop forests/jungles AND build forts.",
      "Expand wide; free roads help movement."
    ]
  },
  "JULIUS": {
    name: "Rome (Julius Caesar)",
    focus: "Domination/Gold",
    keyTechs: ["Iron Working", "Steel"],
    keyCivics: ["Mercenaries"],
    tips: [
      "Farm Barbarian camps for massive gold.",
      "Conquer cities to get free units. Snowball early.",
      "Keep a Wildcard slot open for flexible policy switching."
    ]
  },
  "AMBIORIX": {
    name: "Gaul",
    focus: "Domination/Science",
    keyTechs: ["Iron Working", "Apprenticeship"],
    keyCivics: ["Early Empire", "Feudalism", "Guilds"],
    tips: [
      "Rush Oppidums (Industrial Zone) immediately; they unlock early.",
      "Build Builders before Monuments; Mines provide culture.",
      "Save gold to buy tiles for Oppidum placement (can't be next to City Center)."
    ]
  },
  "PERICLES": {
    name: "Greece (Pericles)",
    focus: "Culture",
    keyTechs: ["Currency", "Industrialization", "Computers"],
    keyCivics: ["Drama and Poetry", "Feudalism", "Ideology"],
    tips: [
      "Build Acropolis on hills for easy envoys and culture adjacency.",
      "Use Wildcard Policy Slot for Autocratic/Republican Legacy early.",
      "Scale culture through City-State suzerainty (5% per suzerain)."
    ]
  },
  "GORGO": {
    name: "Greece (Gorgo)",
    focus: "Culture/Domination",
    keyTechs: ["Bronze Working", "Iron Working"],
    keyCivics: ["Military Tradition", "Drama and Poetry"],
    tips: [
      "Gain culture from killing units. Stay at war for culture generation.",
      "Acropolis on hills for envoys and culture.",
      "Hoplites are strong early; use them aggressively."
    ]
  },
  "MATTHIAS": {
    name: "Hungary",
    focus: "Domination/Science",
    keyTechs: ["Iron Working", "Industrialization"],
    keyCivics: ["Feudalism", "Foreign Ministry"],
    tips: [
      "Settle across rivers from City Center for +50% district production.",
      "Levy City-State units for cheap map control and upgrades.",
      "Build Thermal Baths (Zoo) for massive production/amenities."
    ]
  },
  "WILHELMINA": {
    name: "Netherlands",
    focus: "Science/Sim",
    keyTechs: ["Celestial Navigation", "Industrialization"],
    keyCivics: ["Civil Engineering", "Globalization"],
    tips: [
      "Use rivers for +2 adjacency on Campuses/Theaters/Industrial Zones.",
      "Spam Polders on water tiles for food/production/gold.",
      "Utilize Free Inquiry Golden Age with high-adjacency Harbors."
    ]
  },
  "KRISTINA": {
    name: "Sweden",
    focus: "Culture",
    keyTechs: ["Printing", "Flight", "Computers"],
    keyCivics: ["Drama and Poetry", "Humanism"],
    tips: [
      "Build Apadana/Great Library to auto-theme Great Works.",
      "Construct Open Air Museums in every city; settle diverse terrains.",
      "Pass World Congress resolutions for Great Person points."
    ]
  },
  "ALEXANDER": {
    name: "Macedon",
    focus: "Domination/Science",
    keyTechs: ["Bronze Working", "Iron Working"],
    keyCivics: ["Military Training"],
    tips: [
      "Build Basilikoi Paides in Encampments for science from unit production.",
      "Never stop warring; you have no war weariness.",
      "Heal entire army by capturing a city with a wonder."
    ]
  },
  "VICTORIA": {
    name: "England",
    focus: "Naval/Science",
    keyTechs: ["Celestial Navigation", "Industrialization"],
    keyCivics: ["Naval Tradition"],
    tips: [
      "RUSH Royal Navy Dockyards. Cheap and give gold/trade.",
      "Use 'Free Inquiry' + 'Naval Infrastructure' for massive Science.",
      "Strategic Resource mines get +1 production."
    ]
  },
  "ELEANOR_ENGLAND": {
    name: "England (Eleanor)",
    focus: "Loyalty/Culture",
    keyTechs: ["Printing"],
    keyCivics: ["Drama and Poetry"],
    tips: [
      "Great Works reduce enemy city loyalty. Stack them near borders.",
      "Flip cities peacefully without war.",
      "Royal Navy Dockyards still give trade routes."
    ]
  },
  "ELEANOR_FRANCE": {
    name: "France (Eleanor)",
    focus: "Loyalty/Culture",
    keyTechs: ["Printing"],
    keyCivics: ["Drama and Poetry"],
    tips: [
      "Great Works reduce enemy city loyalty. Stack them near borders.",
      "Chateaux + Great Works = Loyalty pressure.",
      "Flip cities peacefully through culture."
    ]
  },
  "CATHERINE": {
    name: "France (Catherine)",
    focus: "Culture/Wonders",
    keyTechs: ["Castles"],
    keyCivics: ["Divine Right"],
    tips: [
      "Double Tourism from Wonders.",
      "Chateaux must be next to bonus resource/luxury.",
      "Use Spies to steal Great Works."
    ]
  },
  "HARALD": {
    name: "Norway",
    focus: "Religious/Naval",
    keyTechs: ["Sailing", "Shipbuilding"],
    keyCivics: ["Theology"],
    tips: [
      "Pillage Economy: You heal when coastal raiding.",
      "Protect Apostles with Longships.",
      "Stave Churches give production on sea resources."
    ]
  },
  "JOAO": {
    name: "Portugal",
    focus: "Trade Gold",
    keyTechs: ["Cartography"],
    keyCivics: ["Mercantilism"],
    tips: [
      "Can only trade with coastal cities.",
      "Trade routes yield +50% yields.",
      "Nau unit can build Feitoria in foreign lands for massive trade bonuses."
    ]
  },
  "BASIL": {
    name: "Byzantium",
    focus: "Religion/Domination",
    keyTechs: ["Horseback Riding", "Printing"],
    keyCivics: ["Divine Right"],
    tips: [
      "Hippodromes give free Heavy Cavalry; build them everywhere.",
      "Spread religion to enemies for +3 Combat Strength per city.",
      "Cavalry does full damage to walls if city follows your religion."
    ]
  },
  "PETER": {
    name: "Russia",
    focus: "Religion/Culture",
    keyTechs: ["Astrology", "Writing"],
    keyCivics: ["Theology"],
    tips: [
      "Dance of the Aurora pantheon + Lavra = Easy +6 Faith/Production.",
      "Great Writers/Artists spawn very early; sell works if no slots.",
      "Settle Tundra for extra yields."
    ]
  },
  "FREDERICK": {
    name: "Germany (Frederick)",
    focus: "Production/Science",
    keyTechs: ["Apprenticeship", "Industrialization"],
    keyCivics: ["Guilds"],
    tips: [
      "HANSA PLANNING: Place Hansas next to Commercial Hubs (+2 adj).",
      "Extra Military Policy slot helps early game.",
      "Scale into late game; you can support 1-2 more districts per city."
    ]
  },
  "JADWIGA": {
    name: "Poland (Jadwiga)",
    focus: "Religion/Relics",
    keyTechs: ["Astrology"],
    keyCivics: ["Divine Right"],
    tips: [
      "RELIC RUSH: Found religion ASAP to get a free Relic. Use 'Reliquaries' belief.",
      "Use Culture bombs from Encampments/Forts to steal land.",
      "Gold from Relics helps fund expansion."
    ]
  },
  "ROBERT": {
    name: "Scotland",
    focus: "Science/Production",
    keyTechs: ["Industrialization"],
    keyCivics: ["Diplomatic Service"],
    tips: [
      "Keep cities 'Ecstatic' (+5 amenities) for +20% Science/Production.",
      "Build Golf Courses and Water Parks.",
      "Do not go to war; stay at peace for bonuses."
    ]
  },
  "TOMYRIS": {
    name: "Scythia",
    focus: "Early Domination",
    keyTechs: ["Horseback Riding"],
    keyCivics: ["Military Tradition"],
    tips: [
      "Build 1 Light Cavalry, get 2. Delete the extra for gold if needed.",
      "Saka Horse Archers are weak; focus on Horsemen.",
      "Units heal +50 HP on kill; attack wounded units."
    ]
  },
  "SHAKA": {
    name: "Zulu",
    focus: "Domination",
    keyTechs: ["Military Tactics", "Mercenaries"],
    keyCivics: ["Mercenaries", "Nationalism"],
    tips: [
      "Rush 'Mercenaries' civic to unlock Corps early.",
      "Ikanda district builds corps/armies faster.",
      "Loyalty pressure from garrisons keeps conquered cities."
    ]
  },
  "TAMAR": {
    name: "Georgia",
    focus: "Walls/Faith",
    keyTechs: ["Masonry"],
    keyCivics: ["Theology"],
    tips: [
      "Golden Age dedications give Normal Age bonuses too.",
      "Protectorate Wars give double faith.",
      "Tsikhe (Walls) gives Faith."
    ]
  },
  "LAUTARO": {
    name: "Mapuche",
    focus: "Anti-Golden Age",
    keyTechs: ["Horseback Riding"],
    keyCivics: ["Mercenaries"],
    tips: [
      "+10 Combat Strength vs Civs in Golden Age.",
      "Killing units reduces enemy city loyalty.",
      "Chemamull improvement gives Culture equal to 75% of Appeal."
    ]
  },

  // AFRICA & MIDDLE EAST
  "SALADIN": {
    name: "Arabia",
    focus: "Religion/Domination",
    keyTechs: ["Stirrups", "Cartography", "Combustion"],
    keyCivics: ["Theology", "Divine Right", "Theocracy"],
    tips: [
      "Utilize Mamluk unique unit which heals every turn.",
      "Build Madrasas early for faith generation alongside science.",
      "Last Great Prophet guarantee allows early economic focus."
    ]
  },
  "AMANITORE": {
    name: "Nubia",
    focus: "Production/Domination",
    keyTechs: ["Masonry", "Apprenticeship", "Ballistics"],
    keyCivics: ["Early Empire", "Feudalism"],
    tips: [
      "Build Nubian Pyramids on desert tiles for Faith/Food/District boost.",
      "Utilize +20% production toward districts.",
      "Use Pitati Archers for early defense or aggression."
    ]
  },
  "SUNDIATA": {
    name: "Mali (Sundiata)",
    focus: "Culture/Gold",
    keyTechs: ["Currency", "Apprenticeship"],
    keyCivics: ["Drama and Poetry", "Natural History"],
    tips: [
      "Purchase Markets and Suguba buildings with Gold/Faith immediately.",
      "Recruit Great Writers; Works of Writing gain extra gold/tourism.",
      "Use Moksha to purchase districts with Faith."
    ]
  },
  "MANSA": {
    name: "Mali (Mansa Musa)",
    focus: "Gold/Faith",
    keyTechs: ["Currency"],
    keyCivics: ["Guilds"],
    tips: [
      "Mines give -1 Production but +4 Gold. BUY everything.",
      "Suguba discounts purchases by 20%.",
      "Settle DESERT for Desert Folklore pantheon."
    ]
  },
  "MENELIK": {
    name: "Ethiopia",
    focus: "Religion/Culture",
    keyTechs: ["Astrology", "Flight"],
    keyCivics: ["Theology", "Reformed Church"],
    tips: [
      "Settle on Hills for combat/yield bonuses.",
      "15% of Faith is converted to Science/Culture.",
      "Rock-Hewn Churches on hills are massive Faith generators."
    ]
  },
  "CLEOPATRA": {
    name: "Egypt (Cleopatra)",
    focus: "Wonder/Trade",
    keyTechs: ["Masonry", "Bronze Working"],
    keyCivics: ["Foreign Trade", "Early Empire"],
    tips: [
      "+15% production to wonders on rivers. Prioritize Pyramids.",
      "Trade routes to allies give +4 gold. Build Commercial Hubs.",
      "Sphinxes give culture and faith; place next to wonders."
    ]
  },
  "SULEIMAN": {
    name: "Ottomans",
    focus: "Domination/Science",
    keyTechs: ["Gunpowder", "Banking", "Industrialization"],
    keyCivics: ["Mercenaries", "Democracy"],
    tips: [
      "Build Grand Bazaar in every city for amenities/strategics.",
      "Pre-build Warriors and upgrade to Janissaries to avoid pop loss.",
      "Rush Democracy to maximize Grand Bazaar trade routes."
    ]
  },
  "GILGAMESH": {
    name: "Sumeria",
    focus: "Early Rush/Science",
    keyTechs: ["Writing"],
    keyCivics: ["Foreign Trade"],
    tips: [
      "War Cart is available turn 1; rush nearest neighbor.",
      "Ziggurat improvement gives Science; spam on rivers.",
      "No warmonger penalty for joint wars."
    ]
  },
  "HAMMURABI": {
    name: "Babylon",
    focus: "Eureka Science",
    keyTechs: ["Apprenticeship", "Industrialization"],
    keyCivics: ["Recorded History"],
    tips: [
      "Science penalty (-50%) means you MUST trigger Eurekas.",
      "Build 3 Mines -> Apprenticeship instantly.",
      "Great Library is top priority wonder."
    ]
  },
  "CYRUS": {
    name: "Persia",
    focus: "Culture/Domination",
    keyTechs: ["Iron Working", "Industrialization"],
    keyCivics: ["Political Philosophy", "Medieval Fairs"],
    tips: [
      "Declare Surprise Wars for +2 movement.",
      "Utilize Pairidaezas for culture/gold appeal.",
      "Gain culture on internal trade routes."
    ]
  },
  "DIDO": {
    name: "Phoenicia",
    focus: "Naval Expansion",
    keyTechs: ["Writing", "Celestial Navigation"],
    keyCivics: ["Foreign Trade"],
    tips: [
      "Move Capital project unlocks colonial taxes.",
      "Cothon builds naval units/settlers 50% faster.",
      "Settlers have +2 movement and vision on water."
    ]
  },
  "MVEMBA": {
    name: "Kongo (Mvemba)",
    focus: "Relics/Culture",
    keyTechs: ["Education"],
    keyCivics: ["Humanism"],
    tips: [
      "Cannot found religion but gets apostles from other religions.",
      "Double Great Person points from Relics.",
      "Mbanza neighborhood replacement is very strong early."
    ]
  },
  "PHILIP": {
    name: "Spain (Philip)",
    focus: "Religion/Naval",
    keyTechs: ["Celestial Navigation"],
    keyCivics: ["Theology"],
    tips: [
      "Missionaries have extra spreads. Rush religion.",
      "Conquistadors get +10 combat strength near missionary.",
      "Missions on other continents give science/faith."
    ]
  },

  // ASIA & OCEANIA
  "QIN": {
    name: "China (Qin Shi Huang)",
    focus: "Culture/Wonders",
    keyTechs: ["Astrology", "Masonry", "Apprenticeship"],
    keyCivics: ["Drama and Poetry", "Feudalism"],
    tips: [
      "Use Builder charges to rush Ancient/Classical wonders.",
      "Select Monumentality Golden Age to buy civilians with Faith.",
      "Found religion with Sacred Places to boost wonder yields."
    ]
  },
  "YONGLE": {
    name: "China (Yongle)",
    focus: "Science",
    keyTechs: ["Apprenticeship", "Industrialization", "Rocketry"],
    keyCivics: ["Feudalism", "Globalization"],
    tips: [
      "Use Lijia project (Food) to rush cities to 10 Pop quickly.",
      "Leverage extra Eureka/Inspiration progress (50% vs 40%).",
      "Prioritize Eurekas heavily."
    ]
  },
  "KUBLAI_CHINA": {
    name: "China (Kublai)",
    focus: "Trade/Eurekas",
    keyTechs: ["Masonry"],
    keyCivics: ["Foreign Trade"],
    tips: [
      "Extra economic policy slot from start.",
      "Trade routes give Eurekas/Inspirations.",
      "Combine with Great Wall for gold/culture."
    ]
  },
  "TOKUGAWA": {
    name: "Japan (Tokugawa)",
    focus: "Science/Sim",
    keyTechs: ["Celestial Navigation", "Industrialization"],
    keyCivics: ["Globalization"],
    tips: [
      "Send Internal Trade Routes exclusively for district-scaled yields.",
      "Cluster districts for Meiji Restoration adjacency.",
      "Target Communism for Collectivization card."
    ]
  },
  "HOJO": {
    name: "Japan (Hojo)",
    focus: "District Clusters",
    keyTechs: ["Electronics"],
    keyCivics: ["Feudalism"],
    tips: [
      "Meiji Restoration: Districts get +1 adjacency from adjacent districts.",
      "Cluster cities close together.",
      "Electronics Factories give culture to nearby cities."
    ]
  },
  "SEONDEOK": {
    name: "Korea",
    focus: "Pure Science",
    keyTechs: ["Writing", "Education"],
    keyCivics: ["Recorded History"],
    tips: [
      "Seowons gives +4 Science. Place them isolated on hills.",
      "Governor Pingala in your biggest city is mandatory.",
      "Mines adjacent to Seowons get +1 Science."
    ]
  },
  "SEJONG": {
    name: "Korea (Sejong)",
    focus: "Science",
    keyTechs: ["Writing", "Education"],
    keyCivics: ["Recorded History"],
    tips: [
      "Seowon adjacency from hills, not districts.",
      "Governor Pingala boosts science massively.",
      "Hwach'a siege units are devastating."
    ]
  },
  "BA_TRIEU": {
    name: "Vietnam",
    focus: "Domination/Defense",
    keyTechs: ["Bronze Working", "Machinery", "Ballistics"],
    keyCivics: ["Medieval Fairs", "Defensive Tactics"],
    tips: [
      "Build Thanh (Encampment) early for culture.",
      "Units gain bonuses in Woods/Rainforest/Marsh.",
      "Use Voi Chien to kite enemies efficiently."
    ]
  },
  "JOHN_CURTIN": {
    name: "Australia",
    focus: "Appeal/Science",
    keyTechs: ["Scientific Theory"],
    keyCivics: ["Conservation"],
    tips: [
      "Campuses get +3 adjacency on 'Breathtaking' tiles.",
      "Liberate cities to get 100% Production for 10 turns.",
      "Build Outback Stations for massive food/production."
    ]
  },
  "KUPE": {
    name: "Maori",
    focus: "Culture/Nature",
    keyTechs: ["Conservation"],
    keyCivics: ["Mercenaries"],
    tips: [
      "Do not chop Woods/Rainforest. Unimproved features give yields.",
      "Settle on turn 1-3? No, explore ocean first.",
      "Marae replaces Amphitheater and buffs features."
    ]
  },
  "GANDHI": {
    name: "India",
    focus: "Peaceful Religion",
    keyTechs: ["Astrology"],
    keyCivics: ["Theology"],
    tips: [
      "Gain Faith from every Civ you met that has a religion.",
      "Stepwells provide Housing and Food.",
      "War Weariness is doubled for enemies fighting you."
    ]
  },
  "CHANDRAGUPTA": {
    name: "India (Chandragupta)",
    focus: "War Elephant Domination",
    keyTechs: ["Horseback Riding", "Military Tactics"],
    keyCivics: ["Military Tradition"],
    tips: [
      "Declare War of Territorial Expansion for +2 movement and +5 combat.",
      "Varu elephants are expensive but devastating.",
      "Stepwells provide food and faith for war economy."
    ]
  },
  "GENGHIS": {
    name: "Mongolia",
    focus: "Cavalry Domination",
    keyTechs: ["Horseback Riding", "Stirrups"],
    keyCivics: ["Divine Right"],
    tips: [
      "Send trade route to target for +6 Combat Strength.",
      "Capture enemy cavalry instead of killing them.",
      "Keshigs are ranged cavalry; use them to escort civilians."
    ]
  },
  "KUBLAI_MONGOLIA": {
    name: "Mongolia (Kublai)",
    focus: "Trade/Cavalry",
    keyTechs: ["Horseback Riding"],
    keyCivics: ["Foreign Trade"],
    tips: [
      "Extra economic policy slot from start.",
      "Trade routes give diplomatic visibility.",
      "Combine with Mongolian cavalry bonuses."
    ]
  },
  "JAYAVARMAN": {
    name: "Khmer",
    focus: "Tall Religion",
    keyTechs: ["Engineering"],
    keyCivics: ["Theology"],
    tips: [
      "Holy Sites on rivers give Food equal to adjacency.",
      "Aqueducts give Amenity and Faith.",
      "River Goddess Pantheon is mandatory."
    ]
  },
  "GITARJA": {
    name: "Indonesia",
    focus: "Naval/Religion",
    keyTechs: ["Celestial Navigation"],
    keyCivics: ["Theology"],
    tips: [
      "Faith purchase naval units. Jongs are very strong.",
      "Kampungs give housing on coast.",
      "Holy Sites adjacent to coast get +2 adjacency."
    ]
  }
};
