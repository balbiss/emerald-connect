import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

interface QueueProps {
  campaignName: string;
  sent: number;
  total: number;
  status: "sending" | "paused" | "completed";
}

export function ProcessingQueue({ campaignName, sent, total, status }: QueueProps) {
  const pct = Math.round((sent / total) * 100);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${status === "sending" ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
          <span className="text-sm font-medium text-foreground">{campaignName}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          status === "sending" ? "bg-primary/20 text-primary" :
          status === "completed" ? "bg-primary/10 text-primary" :
          "bg-warning/20 text-warning"
        }`}>
          {status === "sending" ? "Enviando" : status === "completed" ? "Concluído" : "Pausado"}
        </span>
      </div>
      <Progress value={pct} className="h-2 mb-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{sent.toLocaleString()} / {total.toLocaleString()} mensagens</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
