import { useState } from "react";
import { Users, Upload, Plus, Search, CheckCircle2, XCircle, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockContacts = [
  { id: 1, name: "João Silva", phone: "+5511999991234", valid: true, lists: ["VIP"] },
  { id: 2, name: "Maria Santos", phone: "+5521988887654", valid: true, lists: ["Leads"] },
  { id: 3, name: "Pedro Oliveira", phone: "+5531977776543", valid: false, lists: ["Geral"] },
  { id: 4, name: "Ana Costa", phone: "+5541966665432", valid: true, lists: ["VIP", "Leads"] },
  { id: 5, name: "Carlos Souza", phone: "+5551955554321", valid: true, lists: ["Geral"] },
];

const mockLists = [
  { name: "Todos os contatos", count: 8234 },
  { name: "Clientes VIP", count: 1200 },
  { name: "Leads Quentes", count: 3400 },
  { name: "Inativos > 30d", count: 2100 },
];

export default function Audience() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Audiência</h1>
          <p className="text-sm text-muted-foreground mt-1">Importe contatos e crie listas segmentadas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Importar CSV/Excel
          </Button>
          <Button className="gradient-emerald text-primary-foreground font-semibold gap-2">
            <Plus className="h-4 w-4" /> Nova Lista
          </Button>
        </div>
      </div>

      {/* Lists overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mockLists.map((list, i) => (
          <div key={i} className="glass-card p-4 animate-fade-in cursor-pointer hover:border-primary/30 transition-colors" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{list.name}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{list.count.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Contacts table */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">Contatos</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contato..."
              className="pl-9 bg-secondary/30 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead className="text-muted-foreground">Nome</TableHead>
              <TableHead className="text-muted-foreground">Telefone</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Listas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockContacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((contact) => (
              <TableRow key={contact.id} className="border-border/20">
                <TableCell className="font-medium text-foreground">{contact.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{contact.phone}</TableCell>
                <TableCell>
                  {contact.valid ? (
                    <span className="flex items-center gap-1 text-primary text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Válido</span>
                  ) : (
                    <span className="flex items-center gap-1 text-destructive text-xs"><XCircle className="h-3.5 w-3.5" /> Inválido</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">{contact.lists.map((l) => (
                    <Badge key={l} variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0">{l}</Badge>
                  ))}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
