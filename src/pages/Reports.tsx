import { BarChart3, Download, Filter, CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  sent: { label: "Enviado", icon: Clock, className: "text-info" },
  delivered: { label: "Entregue", icon: CheckCircle2, className: "text-primary" },
  read: { label: "Lido", icon: CheckCircle2, className: "text-info" },
  failed: { label: "Falhou", icon: XCircle, className: "text-destructive" },
};

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios de Envio</h1>
          <p className="text-sm text-muted-foreground mt-1">Histórico detalhado com rastreamento</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exportar
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enviados", value: "5.430", pct: "100%", color: "text-foreground" },
          { label: "Entregues", value: "5.180", pct: "95.4%", color: "text-primary" },
          { label: "Lidos", value: "3.620", pct: "66.7%", color: "text-info" },
          { label: "Falhas", value: "250", pct: "4.6%", color: "text-destructive" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.pct}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <Select>
          <SelectTrigger className="w-48 bg-secondary/30 h-9"><SelectValue placeholder="Campanha" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="bf">Black Friday VIP</SelectItem>
            <SelectItem value="re">Reativação</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-36 bg-secondary/30 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
            <SelectItem value="read">Lido</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Destinatário</TableHead>
              <TableHead className="text-muted-foreground">Campanha</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Horário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((r) => {
              const sc = statusConfig[r.status];
              return (
                <TableRow key={r.id} className="border-border/20">
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.to}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.campaign}</TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 text-xs ${sc.className}`}>
                      <sc.icon className="h-3.5 w-3.5" /> {sc.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.time}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
