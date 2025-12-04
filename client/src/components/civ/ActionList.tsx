import { GameState } from "@/lib/mockData";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionListProps {
  recommendations: GameState['recommendations'];
}

export function ActionList({ recommendations }: ActionListProps) {
  return (
    <Card className="glass-panel border-none h-full flex flex-col bg-black/20">
      <CardHeader className="pb-2 pt-4 px-4 shrink-0">
        <CardTitle className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
          <CheckCircle className="w-4 h-4" />
          Priority Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 px-4 pb-4 custom-scrollbar">
        {(recommendations || []).map((rec) => (
          <div 
            key={rec.id} 
            className="group p-3 rounded bg-white/5 border border-white/5 hover:border-accent/30 transition-all"
            data-testid={`rec-${rec.id}`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] h-5 px-1 py-0 border-white/10 text-muted-foreground">
                    {rec.category}
                  </Badge>
                  {rec.priority === 'high' && <AlertTriangle className="w-3 h-3 text-destructive animate-pulse" />}
                </div>
                
                <h4 className="font-medium text-sm text-foreground leading-tight">
                  {rec.title}
                </h4>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-accent transition-colors p-1">
                    <Info className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[250px] bg-zinc-950 border-white/20 p-3 shadow-xl">
                  <p className="font-semibold text-xs text-accent mb-1">Strategic Reasoning:</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{rec.description}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
