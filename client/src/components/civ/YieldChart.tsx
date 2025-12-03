import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, Loader2 } from "lucide-react";
import { GameState } from "@shared/schema";

const chartConfig = {
  science: { label: "Science", color: "hsl(200, 90%, 60%)" },
  culture: { label: "Culture", color: "hsl(280, 70%, 70%)" },
} satisfies ChartConfig;

export function YieldChart() {
  const { data: history, isLoading } = useQuery<GameState[]>({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await fetch("/api/history");
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!history || history.length < 2) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50">
        <TrendingUp className="w-8 h-8 opacity-20" />
        <p className="text-xs uppercase tracking-widest mt-2">Collecting Trend Data...</p>
      </div>
    );
  }

  const chartData = history.map(h => ({
    turn: h.turn,
    science: h.yields.science,
    culture: h.yields.culture
  }));

  return (
    <Card className="glass-panel border-none h-full shadow-none bg-transparent">
      <CardHeader className="pb-2 px-0 pt-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" /> Empire Trajectory
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[180px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillScience" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-civ-science)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-civ-science)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillCulture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-civ-culture)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-civ-culture)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="turn" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="culture" type="monotone" fill="url(#fillCulture)" stroke="var(--color-civ-culture)" strokeWidth={2} stackId="1" />
            <Area dataKey="science" type="monotone" fill="url(#fillScience)" stroke="var(--color-civ-science)" strokeWidth={2} stackId="2" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
