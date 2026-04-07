import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="glass-card p-5 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${
          changeType === "positive" ? "text-primary" :
          changeType === "negative" ? "text-destructive" :
          "text-muted-foreground"
        }`}>
          {change}
        </p>
      )}
    </div>
  );
}
