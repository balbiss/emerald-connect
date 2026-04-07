import { useState } from "react";
import { MessageBuilder } from "@/components/MessageBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Send, Users } from "lucide-react";

export default function Campaigns() {
  const [step, setStep] = useState<"config" | "build">("config");

  if (step === "build") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nova Campanha</h1>
            <p className="text-sm text-muted-foreground mt-1">Monte a mensagem perfeita</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("config")}>Voltar</Button>
            <Button className="gradient-emerald text-primary-foreground font-semibold gap-2">
              <Send className="h-4 w-4" /> Agendar Envio
            </Button>
          </div>
        </div>
        <MessageBuilder />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campanhas de Disparo</h1>
          <p className="text-sm text-muted-foreground mt-1">Crie e gerencie seus envios em massa</p>
        </div>
        <Button className="gradient-emerald text-primary-foreground font-semibold gap-2" onClick={() => setStep("build")}>
          <Send className="h-4 w-4" /> Nova Campanha
        </Button>
      </div>

      {/* Campaign config */}
      <div className="glass-card p-5 space-y-4 animate-fade-in">
        <h3 className="text-sm font-medium text-foreground">Configuração da Campanha</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Nome da Campanha</label>
            <Input placeholder="Ex: Black Friday 2024" className="bg-secondary/30" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Lista de Contatos</label>
            <Select>
              <SelectTrigger className="bg-secondary/30"><SelectValue placeholder="Selecione uma lista" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os contatos (8.234)</SelectItem>
                <SelectItem value="vip">Clientes VIP (1.200)</SelectItem>
                <SelectItem value="leads">Leads Quentes (3.400)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Instância de Envio</label>
            <Select>
              <SelectTrigger className="bg-secondary/30"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">+55 11 9xxxx-1234</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Agendamento</label>
            <div className="flex gap-2">
              <Input type="date" className="bg-secondary/30 flex-1" />
              <Input type="time" className="bg-secondary/30 w-28" />
            </div>
          </div>
        </div>
        <Button className="gradient-emerald text-primary-foreground font-semibold gap-2" onClick={() => setStep("build")}>
          Próximo: Montar Mensagem →
        </Button>
      </div>

      {/* History */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h3 className="text-sm font-medium text-foreground mb-4">Campanhas Recentes</h3>
        <div className="space-y-3">
          {[
            { name: "Black Friday VIP", status: "sending", sent: 4230, total: 5000, date: "05/04/2026" },
            { name: "Reativação Base", status: "completed", sent: 1200, total: 1200, date: "03/04/2026" },
            { name: "Lançamento Produto", status: "scheduled", sent: 0, total: 3400, date: "10/04/2026" },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  c.status === "sending" ? "bg-primary animate-pulse" :
                  c.status === "completed" ? "bg-primary" : "bg-warning"
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.date} • {c.sent}/{c.total} msgs</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                c.status === "sending" ? "bg-primary/20 text-primary" :
                c.status === "completed" ? "bg-primary/10 text-primary" : "bg-warning/20 text-warning"
              }`}>
                {c.status === "sending" ? "Enviando" : c.status === "completed" ? "Concluído" : "Agendado"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
