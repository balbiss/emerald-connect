import { useState } from "react";
import { Users, Upload, Plus, Search, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockContacts = [
  { id: 1, name: "João Silva", phone: "+5511999991234", valid: true, lists: ["VIP"], lastMsg: "há 2h" },
  { id: 2, name: "Maria Santos", phone: "+5521988887654", valid: true, lists: ["Leads"], lastMsg: "há 5h" },
  { id: 3, name: "Pedro Oliveira", phone: "+5531977776543", valid: false, lists: ["Geral"], lastMsg: "—" },
  { id: 4, name: "Ana Costa", phone: "+5541966665432", valid: true, lists: ["VIP", "Leads"], lastMsg: "há 1d" },
  { id: 5, name: "Carlos Souza", phone: "+5551955554321", valid: true, lists: ["Geral"], lastMsg: "há 3d" },
];

const mockLists = [
  { name: "Todos", count: 8234, color: "text-foreground" },
  { name: "VIP", count: 1200, color: "text-primary" },
  { name: "Leads Quentes", count: 3400, color: "text-info" },
  { name: "Inativos >30d", count: 2100, color: "text-warning" },
];

export default function Audience() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Gestão de Audiência</h1>
          <p className="text-sm text-muted-foreground mt-1">Importe contatos e crie listas segmentadas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-border/50 text-muted-foreground hover:text-foreground">
            <Upload className="h-4 w-4" /> Importar CSV
          </Button>
          <Button className="gradient-emerald text-primary-foreground font-semibold gap-2">
            <Plus className="h-4 w-4" /> Nova Lista
          </Button>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockLists.map((list, i) => (
          <div key={i} className="glass-card p-5 animate-fade-in cursor-pointer" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{list.name}</span>
            </div>
            <p className={`text-2xl font-extrabold ${list.color} tracking-tight`}>{list.count.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card-static p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="section-header">
            <h3 className="text-sm font-semibold text-foreground">Contatos</h3>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar contato..." className="pl-9 bg-secondary/30 h-9 border-border/40 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border/20 hover:bg-transparent">
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Nome</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Telefone</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Listas</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Último Envio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockContacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((contact) => (
              <TableRow key={contact.id} className="border-border/10 table-row-hover">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary">{contact.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <span className="font-medium text-foreground text-sm">{contact.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{contact.phone}</TableCell>
                <TableCell>
                  {contact.valid ? (
                    <span className="stat-badge stat-badge-positive"><CheckCircle2 className="h-3 w-3" /> Válido</span>
                  ) : (
                    <span className="stat-badge stat-badge-negative"><XCircle className="h-3 w-3" /> Inválido</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">{contact.lists.map((l) => (
                    <span key={l} className="stat-badge stat-badge-info text-[10px]">{l}</span>
                  ))}</div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{contact.lastMsg}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
