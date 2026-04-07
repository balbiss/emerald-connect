import { Download, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockReports = [
  { id: "MSG-001", to: "+5511999991234", name: "João Silva", status: "delivered", campaign: "Black Friday VIP", time: "14:32:01" },
  { id: "MSG-002", to: "+5521988887654", name: "Maria Santos", status: "read", campaign: "Black Friday VIP", time: "14:32:03" },
  { id: "MSG-003", to: "+5531977776543", name: "Pedro Oliveira", status: "failed", campaign: "Black Friday VIP", time: "14:32:05" },
  { id: "MSG-004", to: "+5541966665432", name: "Ana Costa", status: "sent", campaign: "Reativação", time: "10:15:22" },
  { id: "MSG-005", to: "+5551955554321", name: "Carlos Souza", status: "delivered", campaign: "Reativação", time: "10:15:24" },
  { id: "MSG-006", to: "+5561944443210", name: "Lucia Ferreira", status: "read", campaign: "Reativação", time: "10:15:26" },
];

const statusConfig: Record<string, { label: string; icon: any; badgeClass: string }> = {
  sent: { label: "Enviado", icon: Clock, badgeClass: "stat-badge-neutral" },
  delivered: { label: "Entregue", icon: CheckCircle2, badgeClass: "stat-badge-positive" },
  read: { label: "Lido", icon: CheckCircle2, badgeClass: "stat-badge-info" },
  failed: { label: "Falhou", icon: XCircle, badgeClass: "stat-badge-negative" },
};

export default function Reports() {
  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Relatórios de Envio</h1>
          <p className="text-sm text-muted-foreground mt-1">Histórico detalhado com rastreamento</p>
        </div>
        <Button variant="outline" className="gap-2 border-border/50">
          <Download className="h-4 w-4" /> Exportar
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enviados", value: "5.430", pct: "100%", color: "text-foreground", badge: "stat-badge-neutral" },
          { label: "Entregues", value: "5.180", pct: "95.4%", color: "text-primary", badge: "stat-badge-positive" },
          { label: "Lidos", value: "3.620", pct: "66.7%", color: "text-info", badge: "stat-badge-info" },
          { label: "Falhas", value: "250", pct: "4.6%", color: "text-destructive", badge: "stat-badge-negative" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color} mt-2 tracking-tight`}>{s.value}</p>
            <span className={`stat-badge ${s.badge} mt-2`}>{s.pct}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select>
          <SelectTrigger className="w-48 bg-secondary/30 h-9 border-border/40 text-sm"><SelectValue placeholder="Campanha" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Todas</SelectItem><SelectItem value="bf">Black Friday VIP</SelectItem><SelectItem value="re">Reativação</SelectItem></SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-36 bg-secondary/30 h-9 border-border/40 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="delivered">Entregue</SelectItem><SelectItem value="read">Lido</SelectItem><SelectItem value="failed">Falhou</SelectItem></SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card-static p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <Table>
          <TableHeader>
            <TableRow className="border-border/20 hover:bg-transparent">
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">ID</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Destinatário</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Campanha</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Horário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((r) => {
              const sc = statusConfig[r.status];
              return (
                <TableRow key={r.id} className="border-border/10 table-row-hover">
                  <TableCell className="font-mono text-[11px] text-muted-foreground">{r.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-md bg-secondary/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-bold text-muted-foreground">{r.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{r.to}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.campaign}</TableCell>
                  <TableCell>
                    <span className={`stat-badge ${sc.badgeClass}`}>
                      <sc.icon className="h-3 w-3" /> {sc.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{r.time}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
