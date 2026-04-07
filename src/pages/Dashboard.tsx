import { useMemo } from "react";
import { Send, Users, Smartphone, CheckCircle2, TrendingUp, ArrowUpRight, Clock, Wifi, Loader2 } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ProcessingQueue } from "@/components/ProcessingQueue";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useInstances } from "@/hooks/useInstances";
import { useReports } from "@/hooks/useReports";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { instances, loading: loadingInstances, planLimit } = useInstances();
  const { logs, loading: loadingLogs } = useReports();

  const stats = useMemo(() => {
    const totalSent = logs.length;
    const successLogs = logs.filter(l => ['SENT', 'DELIVERED', 'READ', 'COMPLETED'].includes(l.status.toUpperCase()));
    const successRate = totalSent > 0 ? (successLogs.length / totalSent) * 100 : 0;
    const uniqueContacts = new Set(logs.map(l => l.remote_jid)).size;

    // Chart Data (Last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayName = format(date, "EEE", { locale: ptBR });
      const dayLogs = logs.filter(l => isSameDay(new Date(l.created_at), date));
      const daySuccess = dayLogs.filter(l => ['SENT', 'DELIVERED', 'READ', 'COMPLETED'].includes(l.status.toUpperCase())).length;
      
      return {
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        enviados: dayLogs.length,
        entregues: daySuccess
      };
    });

    // Recent Activity from logs
    const recentActivity = logs.slice(0, 5).map(log => ({
      action: `Mensagem para ${log.remote_jid.split('@')[0]}`,
      time: format(new Date(log.created_at), "HH:mm", { locale: ptBR }),
      status: log.status
    }));

    return { totalSent, successRate, uniqueContacts, last7Days, recentActivity };
  }, [logs]);

  if (loadingInstances || loadingLogs) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">Sincronizando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral da sua operação em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 px-3 py-1">
            <Wifi className="h-3 w-3 animate-pulse" /> Sistema Online
          </Badge>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Mensagens Enviadas" 
          value={stats.totalSent.toLocaleString()} 
          change="+ Ativo" 
          changeType="positive" 
          icon={Send} 
          delay={0} 
        />
        <MetricCard 
          title="Alcance Total" 
          value={stats.uniqueContacts.toLocaleString()} 
          change="Destinatários" 
          changeType="positive" 
          icon={Users} 
          delay={80} 
        />
        <MetricCard 
          title="Taxa de Entrega" 
          value={`${stats.successRate.toFixed(1)}%`} 
          change="Real-time" 
          changeType="positive" 
          icon={CheckCircle2} 
          delay={160} 
          highlight 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card-static p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
             <h3 className="text-base font-bold text-foreground flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-primary" /> Envios da Semana
             </h3>
            <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Enviados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Entregues</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.last7Days}>
                <defs>
                  <linearGradient id="colorEnviados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(145 65% 42%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(145 65% 42%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEntregues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(150 100% 50%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(150 100% 50%)" stopOpacity={0} />
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
                  }}
                />
                <Area type="monotone" dataKey="enviados" stroke="hsl(145 65% 42%)" fill="url(#colorEnviados)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="entregues" stroke="hsl(150 100% 50%)" fill="url(#colorEntregues)" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card-static p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Atividade Recente
            </h3>
            <Badge variant="outline" className="text-[10px]">Real-time</Badge>
          </div>
          <div className="space-y-1">
            {stats.recentActivity.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 text-center">Nenhuma atividade recente</p>
            ) : (
              stats.recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border/10 last:border-0 group">
                  <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${item.status === 'ERROR' ? 'bg-destructive' : 'bg-emerald-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.action}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tighter">
                      {item.time} · {item.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instance Health */}
      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" /> Saúde das Instâncias ({instances.length}/{planLimit})
          </h3>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">Status da Conexão</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {instances.map((inst) => (
            <div key={inst.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-primary/5 hover:border-primary/20 transition-all group">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                  <Smartphone className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-background ${
                  inst.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'
                }`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{inst.name}</p>
                <p className={`text-[10px] font-bold uppercase tracking-tight mt-0.5 ${
                  inst.status === 'CONNECTED' ? 'text-emerald-500' : 'text-destructive'
                }`}>
                  {inst.status === 'CONNECTED' ? 'Online' : 'Desconectado'}
                </p>
              </div>
            </div>
          ))}
          
          {Array.from({ length: Math.max(0, planLimit - instances.length) }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/10 border border-dashed border-border/30 opacity-40">
              <div className="h-10 w-10 rounded-xl bg-muted/5 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-muted-foreground/20" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/50 font-medium">Slot Livre</p>
                <p className="text-[10px] text-muted-foreground/30 mt-0.5 uppercase">Indisponível</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
