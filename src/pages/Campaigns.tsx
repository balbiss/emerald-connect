import { useState } from "react";
import { MessageBuilder } from "@/components/MessageBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

export default function Campaigns() {
  const [step, setStep] = useState<"config" | "build">("config");

  if (step === "build") {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Nova Campanha</h1>
            <p className="text-sm text-muted-foreground mt-1">Monte a mensagem perfeita</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("config")} className="border-border/50">Voltar</Button>
            <Button className="gradient-emerald text-primary-foreground font-semibold gap-2 h-10 px-5">
              <Send className="h-4 w-4" /> Agendar Envio
            </Button>
          </div>
        </div>
        <MessageBuilder />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Campanhas de Disparo</h1>
          <p className="text-sm text-muted-foreground mt-1">Crie e gerencie seus envios em massa</p>
        </div>
        <Button className="gradient-emerald text-primary-foreground font-semibold gap-2 h-10 px-5" onClick={() => setStep("build")}>
          <Send className="h-4 w-4" /> Nova Campanha
        </Button>
      </div>

      {/* Config */}
      <div className="glass-card-static p-6 space-y-5 animate-fade-in">
        <div className="section-header">
          <h3 className="text-sm font-semibold text-foreground">Configuração Rápida</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2 block">Nome da Campanha</label>
            <Input placeholder="Ex: Black Friday 2024" className="bg-secondary/30 border-border/40 h-10" />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2 block">Lista de Contatos</label>
            <Select>
              <SelectTrigger className="bg-secondary/30 border-border/40 h-10"><SelectValue placeholder="Selecione uma lista" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos os contatos (8.234)</SelectItem><SelectItem value="vip">Clientes VIP (1.200)</SelectItem><SelectItem value="leads">Leads Quentes (3.400)</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2 block">Instância de Envio</label>
            <Select>
              <SelectTrigger className="bg-secondary/30 border-border/40 h-10"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent><SelectItem value="1">+55 11 9xxxx-1234</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2 block">Agendamento</label>
            <div className="flex gap-2">
              <Input type="date" className="bg-secondary/30 border-border/40 h-10 flex-1" />
              <Input type="time" className="bg-secondary/30 border-border/40 h-10 w-28" />
            </div>
          </div>
        </div>
        <Button className="gradient-emerald text-primary-foreground font-semibold gap-2 h-10" onClick={() => setStep("build")}>
          Montar Mensagem <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* History */}
      <div className="glass-card-static p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="section-header mb-5">
          <h3 className="text-sm font-semibold text-foreground">Campanhas Recentes</h3>
        </div>
        <div className="space-y-1">
          {[
            { name: "Black Friday VIP", status: "sending", sent: 4230, total: 5000, date: "05/04/2026" },
            { name: "Reativação Base", status: "completed", sent: 1200, total: 1200, date: "03/04/2026" },
            { name: "Lançamento Produto", status: "scheduled", sent: 0, total: 3400, date: "10/04/2026" },
          ].map((c, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-border/10 last:border-0 table-row-hover rounded-lg px-3 -mx-3">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  c.status === "sending" ? "bg-primary/10" : c.status === "completed" ? "bg-info/10" : "bg-warning/10"
                }`}>
                  {c.status === "sending" ? <Send className="h-4 w-4 text-primary animate-pulse" /> :
                   c.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-info" /> :
                   <Clock className="h-4 w-4 text-warning" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{c.date} • {c.sent.toLocaleString()}/{c.total.toLocaleString()} msgs</p>
                </div>
              </div>
              <span className={`stat-badge ${
                c.status === "sending" ? "stat-badge-positive" : c.status === "completed" ? "stat-badge-info" : "stat-badge-warning"
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
