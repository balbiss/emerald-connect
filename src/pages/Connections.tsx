import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Settings, 
  RefreshCw, 
  Trash2, 
  Smartphone, 
  Lock, 
  Shield, 
  Loader2,
  Wifi,
  QrCode
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useInstances } from "@/hooks/useInstances";
import { supabase } from "@/lib/supabase";

export default function Connections() {
  const { instances, loading, planLimit, refresh } = useInstances();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const PROXY_URL = "/api-proxy";

  // Polling para checar status da instância caso o QR Code esteja na tela.
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (qrCode && activeInstanceId) {
      interval = setInterval(async () => {
        try {
          const { data } = await axios.get(`${PROXY_URL}/instances/${activeInstanceId}/status`);
          const state = data?.state || data?.instance?.state || data?.instance?.status || data?.status;
          
          if (["open", "CONNECTED", "connected"].includes(state)) {
             // Pareamento concluído, salva no DB para refletir na tela
             const { data: userData } = await supabase.auth.getUser();
             if (userData.user) {
                await supabase.from("whatsapp_instances")
                  .update({ status: 'CONNECTED' })
                  .eq('instance_id_api', activeInstanceId)
                  .eq('user_id', userData.user.id);
             }
             
             toast.success("WhatsApp Conectado com sucesso!");
             setQrCode(null);
             setActiveInstanceId(null);
             setIsCreating(false);
             setIsModalOpen(false); // Fecha o dialog automaticamente!
             refresh(); 
          }
        } catch (error) {
          // Ignora falhas de status ping silencioso
        }
      }, 3500);
    }

    return () => clearInterval(interval);
  }, [qrCode, activeInstanceId, refresh]);

  const handleCreateInstance = async () => {
    if (!newName) {
      toast.error("Por favor, informe um nome para a instância");
      return;
    }

    setIsCreating(true);
    setQrCode(null);
    
    // Gerar um ID amigável baseado no nome + timestamp
    const instanceIdApi = `${newName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
    setActiveInstanceId(instanceIdApi);

    try {
      // 1. Criar na VPS via Proxy
      const { data: createData } = await axios.post(`${PROXY_URL}/instances`, {
        id: instanceIdApi
      });

      if (createData.id) {
        // 2. Salvar no Supabase
        const { error: dbError } = await supabase.from("whatsapp_instances").insert([{
          instance_id_api: instanceIdApi,
          name: newName,
          status: 'CONNECTING',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

        if (dbError) throw dbError;

        // 3. Buscar QR Code
        const { data: qrData } = await axios.get(`${PROXY_URL}/instances/${instanceIdApi}/qr`);
        if (qrData.qrImage) {
          setQrCode(qrData.qrImage);
          toast.success("Instância criada! Escaneie o QR Code.");
        }
      }
    } catch (error: any) {
      console.error("Erro ao criar instância:", error);
      toast.error(error.response?.data?.error || "Erro ao conectar com a VPS");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta instância?")) return;
    
    setIsDeleting(id);
    try {
      // 1. Deletar na VPS via Proxy
      const instance = instances.find(i => i.id === id);
      if (instance?.instance_id_api) {
        await axios.delete(`${PROXY_URL}/instances/${instance.instance_id_api}`);
      }

      // 2. Deletar no Supabase
      const { error } = await supabase.from("whatsapp_instances").delete().eq("id", id);
      if (error) throw error;
      toast.success("Instância removida com sucesso");
      // O Realtime atualizará a lista automaticamente, mas chamamos refresh por garantia
      refresh();
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar instância");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Sincronizando com Supabase...</p>
      </div>
    );
  }

  const reachedLimit = instances.length >= planLimit;

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Minhas Conexões</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus números de WhatsApp conectados</p>
        </div>

        {!reachedLimit ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-emerald gap-2 text-primary-foreground font-semibold h-10 px-5 transition-all hover:scale-105">
                <Plus className="h-4 w-4" /> Adicionar Número
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Conectar WhatsApp</DialogTitle>
                <DialogDescription>Inicie uma nova conexão via QR Code</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center py-6 gap-6">
                <div className="w-full space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nome da Instância</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Comercial João" 
                    className="bg-secondary/30 h-11 border-border/40"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={!!qrCode || isCreating}
                  />
                </div>

                <div className="h-64 w-64 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center bg-secondary/20 relative group overflow-hidden">
                  {isCreating ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <p className="text-[10px] font-bold text-muted-foreground animate-pulse">Solicitando à API...</p>
                    </div>
                  ) : qrCode ? (
                    <img src={qrCode} alt="WhatsApp QR Code" className="w-full h-full object-contain p-4 animate-in fade-in zoom-in duration-500" />
                  ) : (
                    <QrCode className="h-28 w-28 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                  )}
                </div>

                {!qrCode && !isCreating && (
                   <Button 
                    className="w-full h-12 gradient-emerald text-primary-foreground font-bold shadow-lg shadow-emerald-500/20"
                    onClick={handleCreateInstance}
                   >
                     Gerar QR Code Agora
                   </Button>
                )}

                <div className="text-center max-w-xs">
                  <p className="text-sm text-foreground font-medium mb-1">{qrCode ? "Escaneie o QR Code" : "Instruções"}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Abra o WhatsApp → Menu → Aparelhos conectados → Conectar aparelho
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex items-center gap-3 glass-card-highlight px-5 py-3 border border-warning/20">
            <Lock className="h-4 w-4 text-warning" />
            <div>
              <p className="text-sm font-semibold text-foreground">Limite atingido</p>
              <p className="text-[11px] text-muted-foreground">Seu plano permite até {planLimit} instâncias.</p>
            </div>
            <Button size="sm" className="gradient-emerald text-primary-foreground text-xs ml-2 font-semibold shadow-lg shadow-emerald-500/20">
              Upgrade
            </Button>
          </div>
        )}
      </div>

      {/* Usage bar */}
      <div className="glass-card-static p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Capacidade do Plano</span>
          </div>
          <span className="text-sm font-bold text-foreground">{instances.length}/{planLimit}</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden ring-1 ring-border/30">
          <div 
            className="h-full rounded-full gradient-emerald transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,211,102,0.3)]" 
            style={{ width: `${Math.min((instances.length / planLimit) * 100, 100)}%` }} 
          />
        </div>
      </div>

      <div className="space-y-4">
        {instances.length === 0 && (
          <div className="text-center py-20 glass-card border-dashed">
            <p className="text-muted-foreground italic">Nenhuma instância conectada.</p>
          </div>
        )}

        {instances.map((inst) => (
          <div key={inst.id} className="glass-card p-6 animate-fade-in group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                    <Smartphone className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-card flex items-center justify-center ${
                    inst.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'
                  }`}>
                    <Wifi className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-foreground tracking-tight">{inst.name}</p>
                    <Badge variant="outline" className="text-[10px] h-4 font-mono font-normal opacity-60">
                      {inst.instance_id_api || 'SEM ID'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <Badge className={
                      inst.status === 'CONNECTED' 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }>
                      {inst.status === 'CONNECTED' ? 'Conectado' : 'Desconectado'}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" /> Auto-Reconnect Ativo
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-11 w-11 rounded-xl hover:bg-primary/5">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border/50 max-w-md w-[95%] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" /> Configurações Avançadas
                      </DialogTitle>
                      <DialogDescription>
                        Ajuste o comportamento técnico de <strong>{inst.name}</strong>.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-4">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 border border-border/30">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-semibold">Rejeitar Chamadas</Label>
                          <p className="text-[11px] text-muted-foreground">Bloqueia chamadas de voz/vídeo.</p>
                        </div>
                        <Switch checked={inst.reject_calls} />
                      </div>
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/20 border border-border/30">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-semibold">Sempre Online</Label>
                          <p className="text-[11px] text-muted-foreground">Status online 24/7.</p>
                        </div>
                        <Switch checked={inst.always_online} />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button className="w-full gradient-emerald text-primary-foreground font-bold h-11">
                        Atualizar Configurações
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive h-11 w-11 rounded-xl hover:bg-destructive/5"
                  onClick={() => handleDelete(inst.id)}
                  disabled={isDeleting === inst.id}
                >
                  {isDeleting === inst.id ? <Loader2 className="h-4 w-4 animate-spin text-destructive" /> : <Trash2 className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {Array.from({ length: Math.max(0, planLimit - instances.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="glass-card-static p-6 border-dashed opacity-30 animate-fade-in" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-muted/10 flex items-center justify-center ring-1 ring-border/20">
                <Smartphone className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground/60 font-medium">Slot disponível</p>
                <p className="text-[11px] text-muted-foreground/40 mt-0.5">Aguardando nova conexão</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
