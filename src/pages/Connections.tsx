import { useState } from "react";
import { Smartphone, Plus, QrCode, Trash2, RefreshCw, Lock, Wifi, WifiOff, MoreVertical, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Instance {
  id: string;
  phone: string;
  status: "connected" | "disconnected";
  lastPing: string;
  messagesSent: number;
  uptime: string;
}

const mockInstances: Instance[] = [
  { id: "1", phone: "+55 11 9xxxx-1234", status: "connected", lastPing: "2ms", messagesSent: 12450, uptime: "99.8%" },
];

const MAX_INSTANCES = 3;

export default function Connections() {
  const [instances] = useState<Instance[]>(mockInstances);
  const canAdd = instances.length < MAX_INSTANCES;

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Minhas Conexões</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus números de WhatsApp</p>
        </div>

        {canAdd ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gradient-emerald gap-2 text-primary-foreground font-semibold h-10 px-5">
                <Plus className="h-4 w-4" /> Adicionar Número
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50">
              <DialogHeader>
                <DialogTitle>Conectar WhatsApp</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-10 gap-5">
                <div className="h-52 w-52 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center bg-secondary/20">
                  <QrCode className="h-28 w-28 text-muted-foreground/40" />
                </div>
                <div className="text-center max-w-xs">
                  <p className="text-sm text-foreground font-medium mb-1">Escaneie o QR Code</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Abra o WhatsApp → Menu → Aparelhos conectados → Conectar aparelho
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex items-center gap-3 glass-card-highlight px-5 py-3">
            <Lock className="h-4 w-4 text-warning" />
            <div>
              <p className="text-sm font-semibold text-foreground">Limite atingido</p>
              <p className="text-[11px] text-muted-foreground">Faça upgrade para adicionar mais</p>
            </div>
            <Button size="sm" className="gradient-emerald text-primary-foreground text-xs ml-2 font-semibold">
              Upgrade
            </Button>
          </div>
        )}
      </div>

      {/* Usage bar */}
      <div className="glass-card-static p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Uso de Instâncias</span>
          <span className="text-sm font-bold text-foreground">{instances.length}/{MAX_INSTANCES}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full gradient-emerald transition-all" style={{ width: `${(instances.length / MAX_INSTANCES) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {instances.map((inst) => (
          <div key={inst.id} className="glass-card p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary ring-2 ring-card flex items-center justify-center animate-pulse-slow">
                    <Wifi className="h-2 w-2 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-base font-bold text-foreground tracking-tight">{inst.phone}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="stat-badge stat-badge-positive">Conectado</span>
                    <span className="text-[11px] text-muted-foreground">Ping: {inst.lastPing}</span>
                    <span className="text-[11px] text-muted-foreground">Uptime: {inst.uptime}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-lg font-bold text-foreground">{inst.messagesSent.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">msgs enviadas</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-9 w-9">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {Array.from({ length: MAX_INSTANCES - instances.length }).map((_, i) => (
          <div key={`empty-${i}`} className="glass-card-static p-6 border-dashed opacity-30 animate-fade-in" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-muted/10 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground/60">Slot disponível</p>
                <p className="text-[11px] text-muted-foreground/40 mt-0.5">Conecte um novo número</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
