import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, TrendingUp, Loader2 } from "lucide-react";

export interface StrategosAdvice {
  grade: string;
  status_summary: string;
  bottleneck: string;
  auto_suggest: {
    tech: string;
    civic: string;
    production: string;
  };
  next_moves: Array<{ type: string; action: string; reason: string }>;
  expert_tip: string;
}

interface StrategosPanelProps {
  advice: StrategosAdvice | null;
  isLoading?: boolean;
  error?: string | null;
}

export function StrategosPanel({ advice, isLoading, error }: StrategosPanelProps) {
  const gradeColor = advice ? (
    advice.grade === 'S' || advice.grade === 'A' ? 'text-green-400' :
    advice.grade === 'B' || advice.grade === 'C' ? 'text-yellow-400' : 'text-red-500'
  ) : 'text-muted-foreground';

  return (
    <Card className="glass-panel border-primary/20 bg-black/40" data-testid="panel-strategos">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-serif tracking-widest text-primary flex items-center gap-2">
          <Brain className="w-5 h-5" /> STRATEGOS AI
        </CardTitle>
        {advice && (
          <div className={`text-4xl font-black font-mono ${gradeColor}`} data-testid="text-grade">
            {advice.grade}
          </div>
        )}
        {isLoading && (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-8" data-testid="status-loading">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Analyzing your empire...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded bg-red-950/30 border border-red-500/30" data-testid="status-error">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && !advice && (
          <div className="text-center py-8 text-muted-foreground" data-testid="status-waiting">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Click "Ask Strategos" to get AI coaching advice</p>
          </div>
        )}

        {advice && !isLoading && (
          <>
            <div className="p-3 rounded bg-white/5 border-l-2 border-primary" data-testid="text-summary">
              <p className="text-sm italic text-foreground/90">"{advice.status_summary}"</p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Major Bottleneck
              </h4>
              <Badge variant="destructive" className="text-sm px-3 py-1" data-testid="badge-bottleneck">
                {advice.bottleneck}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-950/30 p-2 rounded border border-blue-500/20" data-testid="suggest-tech">
                <span className="text-[10px] text-blue-400 uppercase">Research</span>
                <div className="font-bold text-sm truncate">{advice.auto_suggest.tech}</div>
              </div>
              <div className="bg-purple-950/30 p-2 rounded border border-purple-500/20" data-testid="suggest-civic">
                <span className="text-[10px] text-purple-400 uppercase">Civic</span>
                <div className="font-bold text-sm truncate">{advice.auto_suggest.civic}</div>
              </div>
              <div className="bg-amber-950/30 p-2 rounded border border-amber-500/20" data-testid="suggest-production">
                <span className="text-[10px] text-amber-400 uppercase">Build</span>
                <div className="font-bold text-sm truncate">{advice.auto_suggest.production}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Tactical Orders</h4>
              {advice.next_moves.map((move, i) => (
                <div 
                  key={i} 
                  className="group relative pl-4 border-l border-white/10 hover:border-accent transition-colors"
                  data-testid={`move-${i}`}
                >
                  <div className="font-semibold text-sm text-foreground group-hover:text-accent">
                    {move.action}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Why: {move.reason}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-white/5 flex items-start gap-2" data-testid="text-tip">
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-100/80">{advice.expert_tip}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
