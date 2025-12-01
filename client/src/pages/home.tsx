import { useQuery } from "@tanstack/react-query";
import { GameState, mockGameState } from "@/lib/mockData";
import { StatCard } from "@/components/civ/StatCard";
import { ActionList } from "@/components/civ/ActionList";
import { AnalysisPanel } from "@/components/civ/AnalysisPanel";
import { Beaker, Music, Anchor, Coins, Hammer, Wheat, Menu, Settings, User, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateRecommendations } from "@/lib/advisor";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import generatedImage from '@assets/generated_images/a_dark,_textured_hex_map_background_for_a_strategy_game_interface.png';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  const { data: serverState, isLoading } = useQuery<GameState | null>({
    queryKey: ["gamestate"],
    queryFn: async () => {
      const res = await fetch("/api/gamestate", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch game state");
      return res.json();
    },
    refetchInterval: 3000,
    staleTime: 1000,
  });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "gamestate") {
          queryClient.setQueryData(["gamestate"], message.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  const baseState = serverState || mockGameState;
  const dynamicRecs = generateRecommendations(baseState);
  
  const state = {
    ...baseState,
    recommendations: dynamicRecs.length > 0 ? dynamicRecs : (baseState.recommendations || [])
  };

  const isConnected = !!serverState;

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
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10" data-testid="connection-status">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-xs text-accent font-mono">LIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">DEMO</span>
              </>
            )}
          </div>

          {/* Game Speed Indicator */}
          {state.gameSpeed && (
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Speed</span>
              <span className="font-mono text-sm text-foreground">{state.gameSpeed.replace("GAMESPEED_", "")}</span>
            </div>
          )}

          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Turn</span>
            <span className="font-mono text-xl font-bold" data-testid="text-turn">{state.turn}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Era</span>
            <span className="font-serif text-lg text-foreground" data-testid="text-era">{state.era}</span>
          </div>
          <div className="text-center border-l border-white/10 pl-8">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Leader</span>
            <span className="font-serif text-lg text-foreground flex items-center gap-2" data-testid="text-leader">
              <User className="w-4 h-4 text-primary" />
              {state.leader}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10" data-testid="button-settings">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10" data-testid="button-menu">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Left Column: Stats & Actions */}
        <div className="col-span-3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pb-20">
          {/* Yields Grid */}
          <div className="grid grid-cols-1 gap-3">
            <StatCard label="Science" value={`+${state.yields.science.toFixed(1)}`} icon={Beaker} colorClass="text-science" />
            <StatCard label="Culture" value={`+${state.yields.culture.toFixed(1)}`} icon={Music} colorClass="text-culture" />
            <StatCard label="Faith" value={`+${state.yields.faith.toFixed(1)}`} icon={Anchor} colorClass="text-faith" />
            <StatCard label="Gold" value={`+${state.yields.gold.toFixed(1)}`} icon={Coins} colorClass="text-gold" />
            <StatCard label="Production" value={state.yields.production} icon={Hammer} colorClass="text-prod" />
            <StatCard label="Food" value={state.yields.food} icon={Wheat} colorClass="text-food" />
          </div>
        </div>

        {/* Center Column: Analysis View */}
        <div className="col-span-6 h-full flex flex-col gap-6">
          <AnalysisPanel alerts={state.alerts || []} />
          
          {/* Current Progress Cards */}
          <div className="grid grid-cols-2 gap-6 h-1/3">
            <div className="glass-panel p-5 rounded-lg flex flex-col justify-between border-t-2 border-t-science/50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold tracking-widest text-science uppercase">Researching</span>
                  <h3 className="font-serif text-xl mt-1" data-testid="text-research">{state.currentResearch?.name || "None"}</h3>
                </div>
                <Beaker className="text-science opacity-50" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{state.currentResearch?.turnsLeft || 0} Turns Left</span>
                  <span>{state.currentResearch?.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-science transition-all duration-500" style={{ width: `${state.currentResearch?.progress || 0}%` }} />
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-lg flex flex-col justify-between border-t-2 border-t-culture/50">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold tracking-widest text-culture uppercase">Civic</span>
                  <h3 className="font-serif text-xl mt-1" data-testid="text-civic">{state.currentCivic?.name || "None"}</h3>
                </div>
                <Music className="text-culture opacity-50" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{state.currentCivic?.turnsLeft || 0} Turns Left</span>
                  <span>{state.currentCivic?.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-culture transition-all duration-500" style={{ width: `${state.currentCivic?.progress || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="col-span-3 h-full pb-6 overflow-hidden">
          <ActionList recommendations={state.recommendations || []} />
        </div>
      </main>
    </div>
  );
}
