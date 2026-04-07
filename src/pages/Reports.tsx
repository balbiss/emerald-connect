import { useState } from "react";
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2,
  Search,
  Filter,
  ArrowUpRight,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useReports } from "@/hooks/useReports";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Reports() {
  const { logs, loading } = useReports();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => 
    log.remote_jid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.message_id_api?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.campaigns?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase() || 'PENDING';
    switch (s) {
      case 'SENT':
      case 'DELIVERED':
      case 'COMPLETED':
      case 'READ':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 font-medium"><CheckCircle2 className="h-3.5 w-3.5" /> Sucesso</Badge>;
      case 'PENDING':
      case 'PROCESSING':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1.5 font-medium"><Clock className="h-3.5 w-3.5" /> Processando</Badge>;
      case 'ERROR':
      case 'FAILED':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1.5 font-medium"><AlertCircle className="h-3.5 w-3.5" /> Falha</Badge>;
      default:
        return <Badge variant="outline" className="font-medium">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-wide">Carregando logs do Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Relatórios de Envio</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe o status de cada mensagem em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 border-border/50 gap-2 font-semibold">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button size="sm" className="h-10 gradient-emerald text-primary-foreground gap-2 font-bold shadow-lg shadow-emerald-500/20">
            <FileSpreadsheet className="h-4 w-4" /> Relatório Full
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Taxa de Entrega</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-foreground">98.2%</span>
            <span className="text-[10px] text-emerald-500 font-bold mb-1 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +2.1%
            </span>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-primary">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Total Enviado (24h)</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-foreground">{logs.length}</span>
            <span className="text-[10px] text-muted-foreground font-medium mb-1 italic">Atualizado agora</span>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Erros Críticos</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-foreground">{logs.filter(l => l.status === 'ERROR').length}</span>
            <span className="text-[10px] text-destructive font-bold mb-1 italic">Verificar proxies</span>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-border/30">
        <div className="p-4 border-b border-border/30 bg-secondary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por número, ID ou campanha..." 
              className="pl-10 h-11 bg-background/50 border-border/30 focus-visible:ring-emerald-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="h-11 border-border/30 flex-1 sm:flex-initial gap-2">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
          </div>
        </div>

        <div className="relative overflow-x-auto enterprise-scroll">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="hover:bg-transparent border-border/30">
                <TableHead className="w-[180px] font-bold text-foreground text-[11px] uppercase tracking-wider py-4">Destinatário</TableHead>
                <TableHead className="font-bold text-foreground text-[11px] uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-bold text-foreground text-[11px] uppercase tracking-wider">Campanha</TableHead>
                <TableHead className="font-bold text-foreground text-[11px] uppercase tracking-wider">ID Pastorini</TableHead>
                <TableHead className="text-right font-bold text-foreground text-[11px] uppercase tracking-wider">Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                    Nenhum relatório encontrado para "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-border/20 hover:bg-primary/5 transition-colors group">
                    <TableCell className="font-medium text-foreground py-4 flex items-center gap-2">
                       <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                         WA
                       </div>
                       {log.remote_jid.split('@')[0]}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">
                      {log.campaigns?.name || 'Envio Avulso'}
                    </TableCell>
                    <TableCell>
                      <code className="text-[10px] bg-secondary/40 px-2 py-1 rounded-md text-muted-foreground font-mono">
                        {log.message_id_api || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-[11px] font-medium">
                      {format(new Date(log.created_at), "dd/MM/yyyy · HH:mm", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-border/30 bg-secondary/5 flex items-center justify-between text-xs text-muted-foreground">
           <p>Mostrando {filteredLogs.length} de {logs.length} registros</p>
           <div className="flex items-center gap-4">
              <p className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Sincronizado via Realtime</p>
           </div>
        </div>
      </div>
    </div>
  );
}
