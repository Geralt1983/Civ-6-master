import { mockGameState } from "@/lib/mockData";
import { StatCard } from "@/components/civ/StatCard";
import { ActionList } from "@/components/civ/ActionList";
import { AnalysisPanel } from "@/components/civ/AnalysisPanel";
import { Beaker, Music, Anchor, Coins, Hammer, Wheat, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";
import { Spinner } from "@/components/ui/spinner";
import generatedImage from '@assets/generated_images/a_dark,_textured_hex_map_background_for_a_strategy_game_interface.png';

export default function Dashboard() {
  const { gameState, isLoading } = useGameState();
  const state = gameState || mockGameState;

  return (
    <div className="min-h-screen w-full text-foreground flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" 
         style={{ backgroundImage: `url(${generatedImage})`, backgroundBlendMode: 'overlay' }}>
      
      {/* Top Bar */}
      <header className="h-16 border-b border-white/10 glass-panel flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
            <span className="font-serif font-bold text-primary text-xl">VI</span>
          </div>
          <div>
            <h1 className="font-serif text-lg leading-none text-primary tracking-widest">CIVILIZATION VI</h1>
            <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Companion Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Turn</span>
            <span className="font-mono text-xl font-bold">{state.turn}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Era</span>
            <span className="font-serif text-lg text-foreground">{state.era}</span>
          </div>
          <div className="text-center border-l border-white/10 pl-8">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Leader</span>
            <span className="font-serif text-lg text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {state.leader}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Connection Status Indicator */}
        {isLoading && !gameState && (
          <div className="col-span-12 glass-panel rounded-lg p-4 flex items-center justify-center gap-3">
            <Spinner className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Waiting for game data from bridge...</span>
          </div>
        )}
        
        {gameState && (
          <div className="col-span-12 glass-panel rounded-lg p-2 flex items-center justify-center gap-3 bg-accent/10 border-accent/30">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-mono">LIVE CONNECTION ACTIVE</span>
          </div>
        )}
        
        {/* Left Column: Stats & Actions */}
        <div className="col-span-3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pb-20">
          {/* Yields Grid */}
          <div className="grid grid-cols-1 gap-3">
            <StatCard label="Science" value={`+${state.yields.science}`} icon={Beaker} colorClass="text-science" />
            <StatCard label="Culture" value={`+${state.yields.culture}`} icon={Music} colorClass="text-culture" />
            <StatCard label="Faith" value={`+${state.yields.faith}`} icon={Anchor} colorClass="text-faith" />
            <StatCard label="Gold" value={`+${state.yields.gold}`} icon={Coins} colorClass="text-gold" />
            <StatCard label="Production" value={state.yields.production} icon={Hammer} colorClass="text-prod" />
            <StatCard label="Food" value={state.yields.food} icon={Wheat} colorClass="text-food" />
          </div>
        </div>

        {/* Center Column: Analysis View */}
        <div className="col-span-6 h-full flex flex-col gap-6">
          <AnalysisPanel alerts={state.alerts} />
          
          {/* Current Progress Cards */}
          <div className="grid grid-cols-2 gap-6 h-1/3">
            <div className="glass-panel p-5 rounded-lg flex flex-col justify-between border-t-2 border-t-science/50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold tracking-widest text-science uppercase">Researching</span>
                  <h3 className="font-serif text-xl mt-1">{state.currentResearch.name}</h3>
                </div>
                <Beaker className="text-science opacity-50" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{state.currentResearch.turnsLeft} Turns Left</span>
                  <span>{state.currentResearch.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-science w-[75%]" />
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-lg flex flex-col justify-between border-t-2 border-t-culture/50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold tracking-widest text-culture uppercase">Civic</span>
                  <h3 className="font-serif text-xl mt-1">{state.currentCivic.name}</h3>
                </div>
                <Music className="text-culture opacity-50" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{state.currentCivic.turnsLeft} Turns Left</span>
                  <span>{state.currentCivic.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-culture w-[40%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="col-span-3 h-full pb-6">
          <ActionList recommendations={state.recommendations} />
        </div>
      </main>
    </div>
  );
}
