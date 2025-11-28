import { useState, useEffect } from "react";
import { GameState } from "@/lib/mockData";
import { Brain, Loader2, Scan, Target, AlertOctagon, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisPanelProps {
  alerts: GameState['alerts'];
}

export function AnalysisPanel({ alerts }: AnalysisPanelProps) {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = () => {
    setScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden h-full">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
            <Brain className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-foreground">Advisor Analysis</h2>
            <p className="text-xs text-muted-foreground font-mono">AI MODEL: STRATEGOS-V6</p>
          </div>
        </div>
        <Button 
          onClick={handleScan} 
          disabled={scanning}
          variant="outline" 
          className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent font-mono uppercase tracking-wider"
        >
          {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Scan className="w-4 h-4 mr-2" />}
          {scanning ? "Analyzing..." : "Scan Screen"}
        </Button>
      </div>

      {/* Scanner Visual */}
      <div className="flex-1 bg-black/40 rounded-lg border border-white/5 relative overflow-hidden group">
         {/* Simulated Screen Content Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
           <Target className="w-32 h-32 text-white/10" strokeWidth={0.5} />
        </div>

        <AnimatePresence>
          {scanning && (
            <motion.div 
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-accent shadow-[0_0_20px_rgba(6,182,212,0.5)] z-20"
            />
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4">
           {scanning ? (
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-mono text-accent">
                 <span>PROCESSING VISUAL DATA...</span>
                 <span>{scanProgress}%</span>
               </div>
               <Progress value={scanProgress} className="h-1 bg-accent/20" />
             </div>
           ) : (
             <div className="space-y-3">
               {alerts.map((alert, i) => (
                 <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card/80 backdrop-blur-sm border border-white/10 p-3 rounded flex gap-3 items-start"
                 >
                   {alert.type === 'danger' ? (
                     <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                   ) : (
                     <AlertOctagon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                   )}
                   <div>
                     <h4 className="text-sm font-bold text-foreground">{alert.message}</h4>
                     <p className="text-xs text-muted-foreground">{alert.details}</p>
                   </div>
                 </motion.div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
