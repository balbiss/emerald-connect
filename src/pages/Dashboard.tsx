import { Send, Users, Smartphone, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ProcessingQueue } from "@/components/ProcessingQueue";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { day: "Seg", enviados: 1240, entregues: 1180 },
  { day: "Ter", enviados: 2100, entregues: 1980 },
  { day: "Qua", enviados: 1800, entregues: 1720 },
  { day: "Qui", enviados: 3200, entregues: 3050 },
  { day: "Sex", enviados: 2800, entregues: 2650 },
  { day: "Sáb", enviados: 1500, entregues: 1420 },
  { day: "Dom", enviados: 900, entregues: 870 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da sua operação</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Mensagens Enviadas" value="13.540" change="+12.5% vs semana anterior" changeType="positive" icon={Send} delay={0} />
        <MetricCard title="Contatos Ativos" value="8.234" change="+340 novos esta semana" changeType="positive" icon={Users} delay={100} />
        <MetricCard title="Instâncias Ativas" value="1/3" change="Plano Starter" changeType="neutral" icon={Smartphone} delay={200} />
        <MetricCard title="Taxa de Entrega" value="95.2%" change="+0.8% vs mês anterior" changeType="positive" icon={CheckCircle2} delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h3 className="text-sm font-medium text-foreground mb-4">Envios da Semana</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEnviados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 69% 49%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 69% 49%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 28% 17%)" />
              <XAxis dataKey="day" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(215 28% 17%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(210 40% 96%)"
                }}
              />
              <Area type="monotone" dataKey="enviados" stroke="hsl(142 69% 49%)" fill="url(#colorEnviados)" strokeWidth={2} />
              <Area type="monotone" dataKey="entregues" stroke="hsl(217 91% 60%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Queue */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h3 className="text-sm font-medium text-foreground">Fila de Processamento</h3>
          <ProcessingQueue campaignName="Black Friday VIP" sent={4230} total={5000} status="sending" />
          <ProcessingQueue campaignName="Reativação Base" sent={1200} total={1200} status="completed" />
          <ProcessingQueue campaignName="Lançamento Novo" sent={0} total={3400} status="paused" />
        </div>
      </div>

      {/* Instance Health */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h3 className="text-sm font-medium text-foreground mb-4">Saúde das Instâncias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse-slow" />
            <div>
              <p className="text-sm font-medium text-foreground">+55 11 9xxxx-1234</p>
              <p className="text-xs text-muted-foreground">Conectado • Último ping: 2s</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 opacity-50">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Slot disponível</p>
              <p className="text-xs text-muted-foreground">Adicione um novo número</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 opacity-50">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Slot disponível</p>
              <p className="text-xs text-muted-foreground">Adicione um novo número</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
