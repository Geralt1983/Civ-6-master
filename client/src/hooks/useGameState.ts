import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { GameState } from "@/lib/mockData";

export function useGameState() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  // Restore from LocalStorage on load (session resilience)
  useEffect(() => {
    const saved = localStorage.getItem("civ6_gamestate");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        queryClient.setQueryData(["gamestate"], parsed);
      } catch (e) { console.error("Failed to load cached state"); }
    }
  }, [queryClient]);

  const { data: gameState, isLoading } = useQuery<GameState | null>({
    queryKey: ["gamestate"],
    queryFn: async () => {
      const response = await fetch("/api/gamestate", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch game state");
      const data = await response.json();
      // Cache valid server response
      localStorage.setItem("civ6_gamestate", JSON.stringify(data));
      return data;
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
          // Cache WebSocket updates for session resilience
          localStorage.setItem("civ6_gamestate", JSON.stringify(message.data));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => ws.close();
  }, [queryClient]);

  return { gameState, isLoading };
}
