import { useState } from "react";
import { Smartphone, Plus, QrCode, Trash2, RefreshCw, AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Instance {
  id: string;
  phone: string;
  status: "connected" | "disconnected" | "warning";
  lastPing: string;
  messagesSent: number;
}

const mockInstances: Instance[] = [
  { id: "1", phone: "+55 11 9xxxx-1234", status: "connected", lastPing: "2s atrás", messagesSent: 12450 },
];

const MAX_INSTANCES = 3;

export default function Connections() {
  const [instances] = useState<Instance[]>(mockInstances);
  const canAdd = instances.length < MAX_INSTANCES;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minhas Conexões</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus números de WhatsApp ({instances.length}/{MAX_INSTANCES})</p>
        </div>

        {canAdd ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gradient-emerald gap-2 text-primary-foreground font-semibold">
                <Plus className="h-4 w-4" /> Adicionar Número
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Conectar WhatsApp</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-8 gap-4">
                <div className="h-48 w-48 bg-secondary/50 rounded-xl flex items-center justify-center border border-dashed border-border">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Abra o WhatsApp no celular → Menu → Aparelhos conectados → Conectar aparelho
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 rounded-lg px-4 py-2">
            <Lock className="h-4 w-4 text-warning" />
            <div>
              <p className="text-sm font-medium text-warning">Limite atingido</p>
              <p className="text-xs text-muted-foreground">Faça upgrade para adicionar mais números</p>
            </div>
            <Button size="sm" variant="outline" className="ml-2 border-warning/30 text-warning text-xs">
              Upgrade
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {instances.map((inst) => (
          <div key={inst.id} className="glass-card p-5 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{inst.phone}</p>
                  <Badge variant={inst.status === "connected" ? "default" : "destructive"} className={inst.status === "connected" ? "bg-primary/20 text-primary border-0 text-xs" : "text-xs"}>
                    {inst.status === "connected" ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Último ping: {inst.lastPing} • {inst.messagesSent.toLocaleString()} mensagens enviadas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive/60 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: MAX_INSTANCES - instances.length }).map((_, i) => (
          <div key={`empty-${i}`} className="glass-card p-5 border-dashed opacity-40 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-muted/20 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Slot disponível</p>
          </div>
        ))}
      </div>
    </div>
  );
}
