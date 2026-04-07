import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
  highlight?: boolean;
}

export function MetricCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0, highlight }: MetricCardProps) {
  return (
    <div
      className={`${highlight ? "glass-card-highlight" : "glass-card"} p-5 animate-fade-in group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        <div className="h-10 w-10 rounded-xl metric-icon flex items-center justify-center transition-transform group-hover:scale-110">
          <Icon className="h-[18px] w-[18px] text-primary" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-foreground tracking-tight">{value}</p>
      {change && (
        <div className="flex items-center gap-1.5 mt-2">
          {changeType === "positive" && <TrendingUp className="h-3 w-3 text-primary" />}
          {changeType === "negative" && <TrendingDown className="h-3 w-3 text-destructive" />}
          <span className={`stat-badge ${
            changeType === "positive" ? "stat-badge-positive" :
            changeType === "negative" ? "stat-badge-negative" :
            "stat-badge-neutral"
          }`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
