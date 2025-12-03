import { GameState } from "@/lib/mockData";
import { AlertTriangle, CheckCircle, ArrowRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface ActionListProps {
  recommendations: GameState['recommendations'];
}

export function ActionList({ recommendations }: ActionListProps) {
  return (
    <TooltipProvider>
      <Card className="glass-panel border-none h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-primary text-lg uppercase tracking-widest">
            <CheckCircle className="w-5 h-5" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {(recommendations || []).map((rec) => (
            <div 
              key={rec.id} 
              className="group relative p-4 rounded-md bg-black/20 border border-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer"
              data-testid={`rec-${rec.id}`}
            >
              <div className="absolute top-0 left-0 w-0 h-0 border-t-[1px] border-l-[1px] border-transparent group-hover:border-accent group-hover:w-3 group-hover:h-3 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[1px] border-r-[1px] border-transparent group-hover:border-accent group-hover:w-3 group-hover:h-3 transition-all duration-300" />

              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={
                  rec.priority === 'high' ? "border-destructive text-destructive bg-destructive/10" : 
                  rec.priority === 'medium' ? "border-primary text-primary bg-primary/10" : 
                  "border-muted text-muted-foreground"
                }>
                  {rec.category}
                </Badge>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Info className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[250px] bg-black/90 border-white/20">
                    <p className="text-sm">{rec.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <h4 className="font-serif text-lg text-foreground mb-1 group-hover:text-accent transition-colors">
                {rec.title}
              </h4>
              
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1">
                {rec.description}
              </p>
              
              <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <span className="text-xs text-accent flex items-center gap-1 uppercase tracking-wider font-bold">
                  Execute <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
