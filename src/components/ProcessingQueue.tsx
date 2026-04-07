import { Progress } from "@/components/ui/progress";
import { Activity, Pause, CheckCircle2 } from "lucide-react";

interface QueueProps {
  campaignName: string;
  sent: number;
  total: number;
  status: "sending" | "paused" | "completed";
}

export function ProcessingQueue({ campaignName, sent, total, status }: QueueProps) {
  const pct = Math.round((sent / total) * 100);

  const statusConfig = {
    sending: { label: "Enviando", icon: Activity, badgeClass: "stat-badge-positive", animate: true },
    completed: { label: "Concluído", icon: CheckCircle2, badgeClass: "stat-badge-info", animate: false },
    paused: { label: "Pausado", icon: Pause, badgeClass: "stat-badge-warning", animate: false },
  };

  const sc = statusConfig[status];

  return (
    <div className="glass-card p-5 group animate-fade-in hover:border-primary/20 transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg ${
              status === "sending" ? "bg-primary/20" : status === "completed" ? "bg-info/20" : "bg-warning/20"
            }`}>
              <sc.icon className={`h-5 w-5 ${
                status === "sending" ? "text-primary" : status === "completed" ? "text-info" : "text-warning"
              } ${sc.animate ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-tight">{campaignName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`stat-badge h-5 flex items-center px-2 text-[9px] uppercase tracking-wider ${sc.badgeClass}`}>
                  {sc.label}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{pct}%</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Progresso</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-2 rounded-full bg-secondary/50 overflow-hidden relative">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                status === "sending" ? "gradient-emerald shadow-[0_0_8px_hsl(145_65%_42%_/_0.3)]" : 
                status === "completed" ? "bg-info shadow-[0_0_8px_hsl(217_91%_60%_/_0.3)]" : 
                "bg-warning/30"
              }`} 
              style={{ width: `${pct}%` }} 
            />
          </div>
          <div className="flex justify-between text-[11px] font-medium text-muted-foreground/80">
            <span>{sent.toLocaleString()} enviadas</span>
            <span>Total: {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
