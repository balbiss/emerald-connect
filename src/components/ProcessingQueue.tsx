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
    <div className="glass-card p-4 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
            status === "sending" ? "bg-primary/10" : status === "completed" ? "bg-info/10" : "bg-warning/10"
          }`}>
            <sc.icon className={`h-4 w-4 ${
              status === "sending" ? "text-primary" : status === "completed" ? "text-info" : "text-warning"
            } ${sc.animate ? "animate-pulse" : ""}`} />
          </div>
          <span className="text-sm font-semibold text-foreground">{campaignName}</span>
        </div>
        <span className={`stat-badge ${sc.badgeClass}`}>{sc.label}</span>
      </div>
      <div className="relative">
        <Progress value={pct} className="h-2 mb-2" />
        {status === "sending" && (
          <div className="absolute top-0 left-0 h-2 rounded-full shimmer" style={{ width: `${pct}%` }} />
        )}
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{sent.toLocaleString()} de {total.toLocaleString()}</span>
        <span className="font-semibold text-foreground">{pct}%</span>
      </div>
    </div>
  );
}
