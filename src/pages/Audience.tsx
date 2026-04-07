import { useState, useMemo } from "react";
import { Users, Upload, Plus, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReports } from "@/hooks/useReports";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Audience() {
  const { logs, loading } = useReports();
  const [searchTerm, setSearchTerm] = useState("");

  const uniqueContacts = useMemo(() => {
    const contactsMap = new Map();
    
    logs.forEach(log => {
      if (!contactsMap.has(log.remote_jid)) {
        contactsMap.set(log.remote_jid, {
          id: log.id,
          phone: log.remote_jid.split('@')[0],
          lastMsg: log.created_at,
          status: log.status,
          campaign: log.campaigns?.name || 'Envio Avulso'
        });
      }
    });
    
    return Array.from(contactsMap.values());
  }, [logs]);

  const filteredContacts = uniqueContacts.filter(c => 
    c.phone.includes(searchTerm) || 
    c.campaign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-sm">Carregando base de contatos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Gestão de Audiência</h1>
          <p className="text-sm text-muted-foreground mt-1">Sua base de contatos alcançados via Supabase</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-border/50 text-muted-foreground hover:text-foreground h-11">
            <Upload className="h-4 w-4" /> Importar CSV
          </Button>
          <Button className="gradient-emerald text-primary-foreground font-bold gap-2 h-11 px-6 shadow-lg shadow-emerald-500/20">
            <Plus className="h-4 w-4" /> Nova Lista
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Total Único</span>
          </div>
          <p className="text-2xl font-black text-foreground tracking-tighter">{uniqueContacts.length}</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Contatos Válidos</span>
          </div>
          <p className="text-2xl font-black text-foreground tracking-tighter">{uniqueContacts.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border/30 bg-secondary/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Contatos Recentes
          </h3>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar contato ou campanha..." 
              className="pl-10 bg-background/50 border-border/30 h-10 text-sm" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="border-border/30">
                <TableHead className="text-[10px] uppercase font-bold text-foreground py-4">WhatsApp</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-foreground">Última Campanha</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-foreground">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-foreground text-right">Interação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                    Nenhum contato encontrado na base real.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className="border-border/10 hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-[10px]">
                          WA
                        </div>
                        <span className="font-mono text-sm text-foreground">+{contact.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">{contact.campaign}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">VÁLIDO</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground font-medium">
                      {format(new Date(contact.lastMsg), "dd MMM · HH:mm", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
