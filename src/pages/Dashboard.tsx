import { Send, Users, Smartphone, CheckCircle2, TrendingUp, ArrowUpRight, Clock, Wifi } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ProcessingQueue } from "@/components/ProcessingQueue";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";

const chartData = [
  { day: "Seg", enviados: 1240, entregues: 1180 },
  { day: "Ter", enviados: 2100, entregues: 1980 },
  { day: "Qua", enviados: 1800, entregues: 1720 },
  { day: "Qui", enviados: 3200, entregues: 3050 },
  { day: "Sex", enviados: 2800, entregues: 2650 },
  { day: "Sáb", enviados: 1500, entregues: 1420 },
  { day: "Dom", enviados: 900, entregues: 870 },
];

const hourlyData = [
  { hour: "08h", msgs: 120 }, { hour: "09h", msgs: 340 }, { hour: "10h", msgs: 520 },
  { hour: "11h", msgs: 610 }, { hour: "12h", msgs: 380 }, { hour: "13h", msgs: 290 },
  { hour: "14h", msgs: 450 }, { hour: "15h", msgs: 680 }, { hour: "16h", msgs: 540 },
  { hour: "17h", msgs: 420 }, { hour: "18h", msgs: 310 }, { hour: "19h", msgs: 190 },
];

const recentActivity = [
  { action: "Campanha 'Black Friday' iniciada", time: "há 3 min", type: "campaign" },
  { action: "1.200 contatos importados", time: "há 15 min", type: "import" },
  { action: "+55 11 9xxxx-1234 reconectado", time: "há 32 min", type: "connection" },
  { action: "Relatório semanal gerado", time: "há 1h", type: "report" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral da sua operação em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="stat-badge stat-badge-positive">
            <Wifi className="h-3 w-3" /> Sistema Online
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Mensagens Enviadas" value="13.540" change="+12.5%" changeType="positive" icon={Send} delay={0} />
        <MetricCard title="Contatos Ativos" value="8.234" change="+340 novos" changeType="positive" icon={Users} delay={80} />
        <MetricCard title="Instâncias Ativas" value="1/3" change="Starter" changeType="neutral" icon={Smartphone} delay={160} />
        <MetricCard title="Taxa de Entrega" value="95.2%" change="+0.8%" changeType="positive" icon={CheckCircle2} delay={240} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card-static p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="section-header">
              <h3 className="text-sm font-semibold text-foreground">Envios da Semana</h3>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Enviados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-info" />
                <span className="text-muted-foreground">Entregues</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEnviados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(145 65% 42%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(145 65% 42%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEntregues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 12%)" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(215 15% 35%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215 15% 35%)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 20% 8%)",
                  border: "1px solid hsl(220 16% 16%)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "hsl(210 40% 96%)",
                  boxShadow: "0 8px 32px hsl(0 0% 0% / 0.4)",
                  padding: "12px 16px",
                }}
              />
              <Area type="monotone" dataKey="enviados" stroke="hsl(145 65% 42%)" fill="url(#colorEnviados)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "hsl(145 65% 42%)", stroke: "hsl(220 20% 8%)", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="entregues" stroke="hsl(217 91% 60%)" fill="url(#colorEntregues)" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Queue */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="section-header">
            <h3 className="text-sm font-semibold text-foreground">Fila de Processamento</h3>
          </div>
          <ProcessingQueue campaignName="Black Friday VIP" sent={4230} total={5000} status="sending" />
          <ProcessingQueue campaignName="Reativação Base" sent={1200} total={1200} status="completed" />
          <ProcessingQueue campaignName="Lançamento Novo" sent={0} total={3400} status="paused" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly distribution */}
        <div className="lg:col-span-2 glass-card-static p-6 animate-fade-in" style={{ animationDelay: "350ms" }}>
          <div className="section-header mb-6">
            <h3 className="text-sm font-semibold text-foreground">Distribuição por Hora (Hoje)</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hourlyData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 12%)" vertical={false} />
              <XAxis dataKey="hour" stroke="hsl(215 15% 35%)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215 15% 35%)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220 20% 8%)", border: "1px solid hsl(220 16% 16%)", borderRadius: "12px", fontSize: "12px", color: "hsl(210 40% 96%)" }} />
              <Bar dataKey="msgs" fill="hsl(145 65% 42%)" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="glass-card-static p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="section-header mb-4">
            <h3 className="text-sm font-semibold text-foreground">Atividade Recente</h3>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 group">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary/50 flex-shrink-0 group-hover:bg-primary transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{item.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instance Health */}
      <div className="glass-card-static p-6 animate-fade-in" style={{ animationDelay: "450ms" }}>
        <div className="section-header mb-5">
          <h3 className="text-sm font-semibold text-foreground">Saúde das Instâncias</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-primary/10 hover:border-primary/20 transition-colors">
            <div className="relative">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-primary ring-2 ring-background animate-pulse-slow" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">+55 11 9xxxx-1234</p>
              <p className="text-[11px] text-primary mt-0.5 font-medium">Conectado • Ping: 2ms</p>
            </div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-dashed border-border/30 opacity-50">
              <div className="h-11 w-11 rounded-xl bg-muted/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground/60">Slot disponível</p>
                <p className="text-[11px] text-muted-foreground/40 mt-0.5">Conecte um número</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
