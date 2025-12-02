// client/src/lib/strategyDb.ts

// --- SECTION 1: TURN BENCHMARKS (Scaled by Game Speed in advisor.ts) ---
export const BENCHMARKS = [
  {
    turn: 30,
    metrics: { science: 15, culture: 20, production: 15 },
    advice: "Early Game Check: You should have a Government Plaza and your first district (Holy Site/Encampment/Campus). Aim for Classical Republic."
  },
  {
    turn: 50,
    metrics: { science: 50, culture: 60, production: 30 },
    advice: "Mid-Game Transition: 2+ districts in all cities. Ensure 'Serfdom' policy is active for builder waves. Prepare for Industrialization."
  },
  {
    turn: 70,
    metrics: { science: 100, culture: 120, production: 50 },
    advice: "Industrial Power: PRIORITIZE RESEARCH LABS (Chemistry). Ignore wonders/military until Labs are done. Power your factories."
  },
  {
    turn: 100,
    metrics: { science: 250, culture: 200, production: 100 },
    advice: "Late Game: Rocketry (Science) or Tanks (Domination) should be unlocked. You should be closing out the game now."
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
    condition: (state: any) => state.turn > 35 && state.turn < 50 && !state.currentCivic?.name?.includes("Feudalism"),
    type: "civic",
    title: "RUSH FEUDALISM",
    desc: "Feudalism unlocks Serfdom (+2 Builder Charges). This is the most important economic spike in the game."
  },
  {
    condition: (state: any) => state.turn > 60 && state.yields.science < 80,
    type: "tech",
    title: "Low Science Warning",
    desc: "You are falling behind benchmarks. Build Campuses/Libraries or prepare to pillage Campuses to catch up."
  },
  {
    condition: (state: any) => state.turn > 90 && !state.currentResearch?.name?.includes("Combustion"),
    type: "tech",
    title: "Modern War Prep",
    desc: "Late game domination requires Tanks (Combustion). Start pre-building Cuirassiers to upgrade them cheaply."
  },
  {
    condition: (state: any) => state.yields.gold < 0,
    type: "city",
    title: "Bankruptcy Warning",
    desc: "Your treasury is shrinking. Delete outdated units or run 'Commercial Hub Investment' projects."
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

// --- SECTION 4: CIVILIZATION STRATEGIES (50+ Leaders) ---
export const CIV_STRATEGIES: Record<string, {
  name: string;
  focus: string;
  keyTechs: string[];
  keyCivics: string[];
  tips: string[];
}> = {
  // === DOMINATION FOCUSED ===
  "TRAJAN": {
    name: "Rome (Trajan)",
    focus: "Domination/Expansion",
    keyTechs: ["Iron Working", "Engineering"],
    keyCivics: ["Political Philosophy", "Civil Service"],
    tips: ["Free Monuments mean fast culture; rush Feudalism.", "Legions can chop forests/jungles AND build forts.", "Expand wide; free roads help movement."]
  },
  "ALEXANDER": {
    name: "Macedon",
    focus: "Domination/Science",
    keyTechs: ["Bronze Working", "Iron Working"],
    keyCivics: ["Military Training"],
    tips: ["Build Basilikoi Paides in Encampments for science from unit production.", "Never stop warring; you have no war weariness.", "Heal entire army by capturing a city with a wonder."]
  },
  "SHAKA": {
    name: "Zulu",
    focus: "Domination",
    keyTechs: ["Military Tactics", "Mercenaries"],
    keyCivics: ["Mercenaries", "Nationalism"],
    tips: ["Rush 'Mercenaries' civic to unlock Corps early.", "Ikanda district builds corps/armies faster.", "Loyalty pressure from garrisons keeps conquered cities."]
  },
  "GENGHIS": {
    name: "Mongolia",
    focus: "Cavalry Domination",
    keyTechs: ["Horseback Riding", "Stirrups"],
    keyCivics: ["Divine Right"],
    tips: ["Send a trade route immediately to your target for +6 Combat Strength (Diplo Visibility).", "Capture enemy cavalry instead of killing them.", "Keshigs are ranged cavalry; use them to escort civilians."]
  },
  "CYRUS": {
    name: "Persia",
    focus: "Domination/Culture",
    keyTechs: ["Iron Working", "Engineering"],
    keyCivics: ["Political Philosophy"],
    tips: ["Declare Surprise Wars for +2 movement to ALL units.", "Build Pairidaeza improvements for culture/gold.", "Occupied cities have no loyalty penalties."]
  },
  "MATTHIAS": {
    name: "Hungary",
    focus: "City-State Domination",
    keyTechs: ["Iron Working", "Castles"],
    keyCivics: ["Foreign Trade"],
    tips: ["Levy City-State units for cheap upgrades and +2 movement.", "Build Commercial Hubs across rivers for faster district building.", "Control city-states to dominate the map."]
  },
  "SIMON": {
    name: "Gran Colombia",
    focus: "Domination",
    keyTechs: ["Military Science"],
    keyCivics: ["Mercenaries"],
    tips: ["+1 Movement to ALL units is broken; use it to pillage and retreat.", "Promote units and move/attack in the same turn.", "Comandante Generals give unique passive buffs; stack them."]
  },
  "BASIL": {
    name: "Byzantium",
    focus: "Religion/Domination",
    keyTechs: ["Horseback Riding", "Printing"],
    keyCivics: ["Divine Right"],
    tips: ["Hippodromes give free Heavy Cavalry; build them everywhere.", "Spread religion to enemies for +3 Combat Strength per converted city.", "Cavalry does full damage to walls if city follows your religion."]
  },
  "TOMYRIS": {
    name: "Scythia",
    focus: "Early Domination",
    keyTechs: ["Horseback Riding"],
    keyCivics: ["Military Tradition"],
    tips: ["Build 1 Light Cavalry, get 2. Delete the extra for gold if needed.", "Saka Horse Archers are weak; focus on Horsemen.", "Units heal +50 HP on kill; attack wounded units."]
  },
  "SULEIMAN": {
    name: "Ottomans",
    focus: "Siege Domination",
    keyTechs: ["Gunpowder", "Siege Tactics"],
    keyCivics: ["Military Training"],
    tips: ["Janissaries are stronger than Muskets but cost population; build them in conquered cities.", "Great Turkish Bombards give massive siege bonuses.", "Use Ibrahim governor to neutralize enemy loyalty."]
  },
  "MONTEZUMA": {
    name: "Aztec (Montezuma)",
    focus: "Domination/Builders",
    keyTechs: ["Bronze Working", "Iron Working"],
    keyCivics: ["Military Tradition"],
    tips: ["Eagle Warriors convert enemies to builders early. Rush 3-4 builders from combat.", "Luxury bonus: +1 combat strength per luxury. Collect them all.", "Build districts fast using captured builders."]
  },
  "GORGO": {
    name: "Greece (Gorgo)",
    focus: "Culture/Domination",
    keyTechs: ["Bronze Working", "Iron Working"],
    keyCivics: ["Military Tradition", "Drama and Poetry"],
    tips: ["Gain culture from killing units. Stay at war for culture generation.", "Acropolis on hills for envoys and culture.", "Hoplites are strong early; use them aggressively."]
  },
  "CHANDRAGUPTA": {
    name: "India (Chandragupta)",
    focus: "War Elephant Domination",
    keyTechs: ["Horseback Riding", "Military Tactics"],
    keyCivics: ["Military Tradition"],
    tips: ["Declare War of Territorial Expansion for +2 movement and +5 combat strength.", "Varu elephants are expensive but devastating.", "Stepwells provide food and faith for war economy."]
  },

  // === SCIENCE FOCUSED ===
  "SEONDEOK": {
    name: "Korea",
    focus: "Pure Science",
    keyTechs: ["Writing", "Education"],
    keyCivics: ["Recorded History"],
    tips: ["Seowons gives +4 Science but -1 for adjacent districts. Place them isolated on hills.", "Governor Pingala in your biggest city is mandatory.", "Mines adjacent to Seowons get +1 Science."]
  },
  "HOJO": {
    name: "Japan",
    focus: "District Clusters",
    keyTechs: ["Electronics"],
    keyCivics: ["Feudalism"],
    tips: ["Meiji Restoration: Districts get +1 adjacency from adjacent districts.", "Cluster cities close together to create mega-district complexes.", "Electronics Factories give culture to nearby cities."]
  },
  "ROBERT": {
    name: "Scotland",
    focus: "Science/Production",
    keyTechs: ["Industrialization"],
    keyCivics: ["Diplomatic Service"],
    tips: ["Keep cities 'Ecstatic' (+5 amenities) for +20% Science/Production.", "Build Golf Courses and Water Parks.", "Do not go to war; stay at peace for bonuses."]
  },
  "JOHN_CURTIN": {
    name: "Australia",
    focus: "Appeal/Science",
    keyTechs: ["Scientific Theory"],
    keyCivics: ["Conservation"],
    tips: ["Campuses get +3 adjacency on 'Breathtaking' tiles.", "Liberate cities to get 100% Production for 10 turns.", "Build Outback Stations for massive food/production."]
  },
  "LADY_SIX_SKY": {
    name: "Maya",
    focus: "Tall Science",
    keyTechs: ["Masonry", "Ballistics"],
    keyCivics: ["Mercenaries"],
    tips: ["Settle cities within 6 tiles of capital for +10% yields.", "Do not settle near fresh water; rely on Farms/Aqueducts.", "Observatories (Campus) get adjacency from Farms/Plantations."]
  },
  "HAMMURABI": {
    name: "Babylon",
    focus: "Eureka Science",
    keyTechs: ["Apprenticeship", "Industrialization"],
    keyCivics: ["Recorded History"],
    tips: ["Science penalty (-50%) means you MUST trigger Eurekas.", "Build 3 Mines -> Apprenticeship instantly. Build 2 Workshops -> Industrialization.", "Great Library is top priority wonder."]
  },
  "FREDERICK": {
    name: "Germany (Frederick)",
    focus: "Production/Science",
    keyTechs: ["Apprenticeship", "Industrialization"],
    keyCivics: ["Guilds"],
    tips: ["HANSA PLANNING: Place Hansas next to Commercial Hubs (+2 adj).", "Extra Military Policy slot helps early game.", "Scale into late game; you can support 1-2 more districts per city."]
  },

  // === CULTURE FOCUSED ===
  "PERICLES": {
    name: "Greece (Pericles)",
    focus: "Culture/City-States",
    keyTechs: ["Printing"],
    keyCivics: ["Drama and Poetry"],
    tips: ["Acropolis must be on hills; build them for Envoys.", "+5% Culture per Suzerain status.", "Do not compete with Gorgo; you win by diplomacy."]
  },
  "PETER": {
    name: "Russia",
    focus: "Religion/Culture",
    keyTechs: ["Astrology", "Writing"],
    keyCivics: ["Theology"],
    tips: ["Dance of the Aurora pantheon + Lavra = Easy +6 Faith/Production.", "Great Writers/Artists spawn very early; sell works if you have no slots.", "Settle Tundra for extra yields."]
  },
  "PEDRO": {
    name: "Brazil",
    focus: "Culture/Great People",
    keyTechs: ["Computers"],
    keyCivics: ["Humanism"],
    tips: ["Amazon: Rainforests give +1 adjacency to districts. Do not chop all of them.", "Street Carnival project generates massive amenities.", "Refund 20% of Great Person points."]
  },
  "WILHELMINA": {
    name: "Netherlands",
    focus: "River Adjacency",
    keyTechs: ["Shipbuilding"],
    keyCivics: ["Civil Engineering"],
    tips: ["Major adjacency (+2) for Campuses/Theaters/Industrial Zones next to Rivers.", "Polders: Build on coast/lake next to 3 land tiles.", "Trade routes give Loyalty and Culture."]
  },
  "KUPE": {
    name: "Maori",
    focus: "Culture/Nature",
    keyTechs: ["Conservation"],
    keyCivics: ["Mercenaries"],
    tips: ["Do not chop Woods/Rainforest. Unimproved features give Production/Culture.", "Settle on turn 1-3? No, explore ocean first.", "Marae replaces Amphitheater and buffs features."]
  },
  "KRISTINA": {
    name: "Sweden",
    focus: "Diplo/Culture",
    keyTechs: ["Scientific Theory"],
    keyCivics: ["Diplomatic Service"],
    tips: ["Auto-theme buildings with 3+ slots.", "Queen's Bibliotheque (Gov Plaza) is powerful.", "Host World Congress competitions to win Diplo Victory."]
  },
  "CATHERINE": {
    name: "France",
    focus: "Culture/Wonders",
    keyTechs: ["Castles"],
    keyCivics: ["Divine Right"],
    tips: ["Double Tourism from Wonders.", "Chateaux must be next to bonus resource/luxury.", "Use Spies to steal Great Works."]
  },
  "THEODORA": {
    name: "Byzantium (Theodora)",
    focus: "Culture/Religion",
    keyTechs: ["Drama and Poetry"],
    keyCivics: ["Theology"],
    tips: ["Hippodromes provide entertainment and faith.", "Spread religion through conquest.", "Great Works from religious buildings."]
  },
  "ELEANOR_ENGLAND": {
    name: "England (Eleanor)",
    focus: "Loyalty/Culture",
    keyTechs: ["Printing"],
    keyCivics: ["Drama and Poetry"],
    tips: ["Great Works reduce enemy city loyalty. Stack them near borders.", "Flip cities peacefully without war.", "Royal Navy Dockyards still give trade routes."]
  },
  "ELEANOR_FRANCE": {
    name: "France (Eleanor)",
    focus: "Loyalty/Culture",
    keyTechs: ["Printing"],
    keyCivics: ["Drama and Poetry"],
    tips: ["Great Works reduce enemy city loyalty. Stack them near borders.", "Chateaux + Great Works = Loyalty pressure.", "Flip cities peacefully through culture."]
  },
  "CLEOPATRA": {
    name: "Egypt (Cleopatra)",
    focus: "Wonder/Trade",
    keyTechs: ["Masonry", "Bronze Working"],
    keyCivics: ["Foreign Trade", "Early Empire"],
    tips: ["+15% production to wonders on rivers. Prioritize Pyramids.", "Trade routes to allies give +4 gold. Build Commercial Hubs.", "Sphinxes give culture and faith; place next to wonders."]
  },

  // === RELIGION FOCUSED ===
  "SALADIN": {
    name: "Arabia",
    focus: "Science/Religion",
    keyTechs: ["Education"],
    keyCivics: ["Theology"],
    tips: ["Last Prophet is guaranteed; don't rush Holy Site prayers.", "Worship buildings are 90% cheaper.", "Madrasa generates Faith equal to Campus adjacency."]
  },
  "MENELIK": {
    name: "Ethiopia",
    focus: "Faith Yields",
    keyTechs: ["Flight"],
    keyCivics: ["Theology"],
    tips: ["Settle on Hills.", "15% of Faith is converted to Science/Culture.", "Rock-Hewn Churches on hills are massive Faith generators."]
  },
  "JAYAVARMAN": {
    name: "Khmer",
    focus: "Tall Religion",
    keyTechs: ["Engineering"],
    keyCivics: ["Theology"],
    tips: ["Holy Sites on rivers give Food equal to adjacency.", "Aqueducts give Amenity and Faith.", "River Goddess Pantheon is mandatory."]
  },
  "GANDHI": {
    name: "India (Gandhi)",
    focus: "Peaceful Religion",
    keyTechs: ["Astrology"],
    keyCivics: ["Theology"],
    tips: ["Gain Faith from every Civ you met that has a religion.", "Stepwells provide Housing and Food.", "War Weariness is doubled for enemies fighting you."]
  },
  "MANSA_MUSA": {
    name: "Mali",
    focus: "Gold/Faith",
    keyTechs: ["Currency"],
    keyCivics: ["Guilds"],
    tips: ["Mines give -1 Production but +4 Gold. BUY everything with Gold/Faith.", "Suguba (Commercial Hub) discounts purchases by 20%.", "Settle DESERT for Desert Folklore pantheon."]
  },
  "JADWIGA": {
    name: "Poland (Jadwiga)",
    focus: "Religion/Relics",
    keyTechs: ["Astrology"],
    keyCivics: ["Divine Right"],
    tips: ["RELIC RUSH: Found religion ASAP to get a free Relic. Use 'Reliquaries' belief.", "Use Culture bombs from Encampments/Forts to steal land.", "Gold from Relics helps fund expansion."]
  },
  "MVEMBA": {
    name: "Kongo (Mvemba)",
    focus: "Relics/Culture",
    keyTechs: ["Education"],
    keyCivics: ["Humanism"],
    tips: ["Cannot found religion but gets apostles from other religions.", "Double Great Person points from Relics.", "Mbanza neighborhood replacement is very strong early."]
  },
  "PHILIP": {
    name: "Spain (Philip)",
    focus: "Religion/Naval",
    keyTechs: ["Celestial Navigation"],
    keyCivics: ["Theology"],
    tips: ["Missionaries have extra spreads. Rush religion.", "Conquistadors get +10 combat strength if near a missionary.", "Missions on other continents give science/faith."]
  },

  // === NAVAL / TRADE / FLEXIBLE ===
  "VICTORIA": {
    name: "England",
    focus: "Naval/Industrial",
    keyTechs: ["Industrialization", "Combustion"],
    keyCivics: ["Mercantilism"],
    tips: ["Royal Navy Dockyards give +1 Trade Route.", "Powered buildings give +4 Yields.", "Free Redcoat unit when settling on foreign continent."]
  },
  "DIDO": {
    name: "Phoenicia",
    focus: "Naval Expansion",
    keyTechs: ["Writing", "Celestial Navigation"],
    keyCivics: ["Foreign Trade"],
    tips: ["Move Capital project unlocks colonial taxes.", "Cothon builds naval units/settlers 50% faster.", "Settlers have +2 movement and vision on water."]
  },
  "HARALD": {
    name: "Norway",
    focus: "Naval Raiding",
    keyTechs: ["Sailing", "Shipbuilding"],
    keyCivics: ["Naval Tradition"],
    tips: ["Melee naval units can coastal raid.", "Pillaging mines/camps kills the improvement but gives science/gold.", "Stave Churches boost sea resource production."]
  },
  "JOAO": {
    name: "Portugal",
    focus: "Trade Gold",
    keyTechs: ["Cartography"],
    keyCivics: ["Mercantilism"],
    tips: ["Can only trade with coastal cities.", "Trade routes yield +50% yields.", "Nau unit can build Feitoria in foreign lands for massive trade bonuses."]
  },
  "GITARJA": {
    name: "Indonesia",
    focus: "Naval/Religion",
    keyTechs: ["Celestial Navigation"],
    keyCivics: ["Theology"],
    tips: ["Faith purchase naval units. Jongs are very strong.", "Kampungs give housing on coast.", "Holy Sites adjacent to coast get +2 adjacency."]
  },

  // === UNIQUE PLAYSTYLES ===
  "PACHACUTI": {
    name: "Inca",
    focus: "Mountain Growth",
    keyTechs: ["Engineering"],
    keyCivics: ["Feudalism"],
    tips: ["Work mountain tiles for production.", "Terrace Farms give food from mountains.", "Use Qhapaq Nan to move through mountains instantly."]
  },
  "WILFRID": {
    name: "Canada",
    focus: "Tundra/Diplo",
    keyTechs: ["Conservation"],
    keyCivics: ["Diplomatic Service"],
    tips: ["Cannot declare Surprise Wars.", "Tundra farms work like normal farms.", "Build Ice Hockey Rinks for appeal/culture."]
  },
  "QIN_SHI_HUANG": {
    name: "China (Mandate)",
    focus: "Wonder Spam",
    keyTechs: ["Masonry"],
    keyCivics: ["Recorded History"],
    tips: ["Builders can rush Ancient/Classical wonders.", "Great Wall gives gold/culture; build on borders.", "Eurekas/Inspirations are 60% instead of 50%."]
  },
  "AMBIORIX": {
    name: "Gaul",
    focus: "Production/Culture",
    keyTechs: ["Iron Working", "Apprenticeship"],
    keyCivics: ["Early Empire"],
    tips: ["Mines give +1 Culture (culture bomb).", "Cannot build districts next to City Center.", "Oppidum (Industrial Zone) unlocks early and has ranged attack."]
  },
  "TAMAR": {
    name: "Georgia",
    focus: "Walls/Faith",
    keyTechs: ["Masonry"],
    keyCivics: ["Theology"],
    tips: ["Golden Age dedications give Normal Age bonuses too.", "Protectorate Wars give double faith.", "Tsikhe (Walls) gives Faith."]
  },
  "LAUTARO": {
    name: "Mapuche",
    focus: "Anti-Golden Age",
    keyTechs: ["Horseback Riding"],
    keyCivics: ["Mercenaries"],
    tips: ["+10 Combat Strength vs Civs in Golden Age.", "Killing units reduces enemy city loyalty.", "Chemamull improvement gives Culture equal to 75% of Appeal."]
  },
  "POUNDMAKER": {
    name: "Cree",
    focus: "Trade/Alliances",
    keyTechs: ["Pottery"],
    keyCivics: ["Civil Service"],
    tips: ["Trade routes claim tiles for your city.", "Mekewap improvement gives Production/Gold.", "Shared visibility with all Alliances."]
  },
  "GILGAMESH": {
    name: "Sumeria",
    focus: "Early Rush/Science",
    keyTechs: ["Writing"],
    keyCivics: ["Foreign Trade"],
    tips: ["War Cart is available turn 1; rush nearest neighbor.", "Ziggurat improvement gives Science; spam on rivers.", "No warmonger penalty for joint wars."]
  },
  "AMANITORE": {
    name: "Nubia",
    focus: "Ranged/Production",
    keyTechs: ["Archery", "Construction"],
    keyCivics: ["Military Tradition"],
    tips: ["Pitati Archers are cheaper and stronger. Rush them.", "+20% Production toward Ranged units.", "Pyramids (Nubian) give adjacency and production."]
  },
  "TEDDY": {
    name: "America (Teddy)",
    focus: "Diplomatic/Culture",
    keyTechs: ["Conservation"],
    keyCivics: ["Conservation"],
    tips: ["+5 Combat Strength on home continent.", "Film Studios give massive tourism late game.", "National Parks are key; build lots of Naturalists."]
  },
  "ABRAHAM": {
    name: "America (Lincoln)",
    focus: "Industrial/Diplo",
    keyTechs: ["Industrialization"],
    keyCivics: ["Civil Service"],
    tips: ["Melee units get +5 combat strength.", "Industrial Zones get extra adjacency.", "Focus on production and late-game military."]
  },
  "KUBLAI_CHINA": {
    name: "China (Kublai)",
    focus: "Trade/Eurekas",
    keyTechs: ["Masonry"],
    keyCivics: ["Foreign Trade"],
    tips: ["Extra economic policy slot from start.", "Trade routes give Eurekas/Inspirations.", "Combine with Great Wall for gold/culture."]
  },
  "KUBLAI_MONGOLIA": {
    name: "Mongolia (Kublai)",
    focus: "Trade/Cavalry",
    keyTechs: ["Horseback Riding"],
    keyCivics: ["Foreign Trade"],
    tips: ["Extra economic policy slot from start.", "Trade routes give diplomatic visibility.", "Combine with Mongolian cavalry bonuses."]
  },
  "BA_TRIEU": {
    name: "Vietnam",
    focus: "Forest Defense",
    keyTechs: ["Bronze Working"],
    keyCivics: ["Early Empire"],
    tips: ["Districts must be built on features (woods/marsh/rainforest).", "+5 combat strength in woods/marsh/rainforest.", "Thanh units are strong defensive cavalry."]
  },
  "LADY_TRUNG": {
    name: "Vietnam (Trung Sisters)",
    focus: "Feature Districts",
    keyTechs: ["Conservation"],
    keyCivics: ["Mercenaries"],
    tips: ["Do not chop features; build districts on them.", "Defensive bonuses in forests.", "Culture bomb from specialty districts."]
  },
  "SEJONG": {
    name: "Korea (Sejong)",
    focus: "Science",
    keyTechs: ["Writing", "Education"],
    keyCivics: ["Recorded History"],
    tips: ["Seowon adjacency from hills, not districts.", "Governor Pingala boosts science massively.", "Hwach'a siege units are devastating."]
  }
};
