import { GameState } from "@shared/schema";
import { Brain, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Alert {
  id: number;
  type: 'danger' | 'opportunity' | 'info';
  message: string;
  details: string;
}

interface AnalysisPanelProps {
  alerts?: Alert[];
}

export function AnalysisPanel({ alerts = [] }: AnalysisPanelProps) {
  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-4 h-full border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-serif text-foreground tracking-wide">Advisor Analysis</h2>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              Live Evaluation • Turn Processing
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 relative z-10 pr-2 custom-scrollbar">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert, i) => (
            <motion.div 
              key={alert.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border flex gap-3 items-start ${
                alert.type === 'danger' 
                  ? 'bg-destructive/10 border-destructive/30' 
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}
            >
              {alert.type === 'danger' ? (
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className={`text-sm font-bold ${
                  alert.type === 'danger' ? 'text-destructive' : 'text-yellow-500'
                }`}>
                  {alert.message}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {alert.details}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 opacity-50">
            <CheckCircle2 className="w-10 h-10" />
            <p className="text-sm font-mono">ALL SYSTEMS NOMINAL</p>
          </div>
        )}
      </div>
    </div>
  );
}
