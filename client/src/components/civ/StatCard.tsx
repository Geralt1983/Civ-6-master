import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string; // e.g., "text-science"
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, icon: Icon, colorClass, subtext, trend }: StatCardProps) {
  return (
    <div className="glass-panel p-4 rounded-lg flex items-center justify-between group hover:bg-white/5 transition-colors">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-mono font-bold text-foreground">{value}</h3>
          {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
        </div>
      </div>
      <div className={cn("p-3 rounded-full bg-white/5 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300", colorClass)}>
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
  );
}
