import { useState, useEffect } from "react";
import { MessageBuilder, MessagePayload } from "@/components/MessageBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Layers,
  Zap,
  Smartphone,
  Settings
} from "lucide-react";
import { useCampaigns, useCampaignActions } from "@/hooks/useCampaigns";
import { useInstances } from "@/hooks/useInstances";
import { useReports } from "@/hooks/useReports";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function Campaigns() {
  const [step, setStep] = useState<"config" | "build">("config");
  const { campaigns, loading: loadingCampaigns } = useCampaigns();
  const { instances, loading: loadingInstances } = useInstances();
  const { logs } = useReports(); // For contact count proxy
  const { createCampaign, isCreating } = useCampaignActions();

  const uniqueContactsCount = new Set(logs.map(l => l.remote_jid)).size;

  // Form State
  const [name, setName] = useState("");
  const [listType, setListType] = useState("all");
  const [manualContacts, setManualContacts] = useState(""); // Novo
  const [instanceId, setInstanceId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [delayMin, setDelayMin] = useState(15); // Novo
  const [delayMax, setDelayMax] = useState(45); // Novo
  
  const [messageConfig, setMessageConfig] = useState<MessagePayload | null>(null);

  // Define default instance when loaded
  useEffect(() => {
     if (instances.length > 0 && !instanceId) {
        setInstanceId(instances[0].id);
     }
  }, [instances]);

  const handleActivate = async () => {
    if (!name) return toast.error("Informe um nome para a campanha");
    if (!instanceId) return toast.error("Selecione uma instância para o disparo");
    if (!messageConfig) return toast.error("Nenhuma mensagem configurada");

    // Construção da lista de números
    let finalNumbers: string[] = [];
    if (listType === "manual") {
      if (!manualContacts.trim()) return toast.error("Você selecionou Lista Manual. Cole os contatos!");
      // Lê cada linha. Espera: número OU número,nome
      // Ex: 5511999999999,João da Silva
      finalNumbers = manualContacts.split('\n').map(line => {
         if (!line.trim()) return null;
         const parts = line.split(',');
         const numberRaw = parts[0] || line;
         const nameRaw = parts.length > 1 ? parts.slice(1).join(',').trim() : '';
         
         const cleanNumber = numberRaw.replace(/\D/g, '');
         if (cleanNumber.length >= 10 && cleanNumber.length <= 15) {
            const jid = cleanNumber.includes('@s.whatsapp.net') ? cleanNumber : `${cleanNumber}@s.whatsapp.net`;
            return nameRaw ? `${jid}|${nameRaw}` : jid;
         }
         return null;
      }).filter(Boolean) as string[];
        
      if (finalNumbers.length === 0) return toast.error("Nenhum contato válido encontrado. Formato Ex: 5511999999999,Nome");
    } else {
      // Pega contatos do BD
      finalNumbers = Array.from(new Set(logs.map(l => l.remote_jid).filter(Boolean)));
    }
    
    // Injeta as configurações de delay no payload pro backend processar
    const enhancedMessageConfig = {
       ...messageConfig,
       options: {
         delayMin: Number(delayMin),
         delayMax: Number(delayMax)
       }
    };

    const result = await createCampaign({
      name,
      instance_id: instanceId,
      numbers_list: finalNumbers,
      message_config: enhancedMessageConfig,
      scheduled_at: scheduledAt || undefined
    });

    if (result) {
       setStep("config");
       setName("");
       setScheduledAt("");
       setManualContacts("");
       setListType("all");
    }
  };

  if (step === "build") {
    return (
      <div className="space-y-6 max-w-[1400px] animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Nova Campanha</h1>
            <p className="text-sm text-muted-foreground mt-1">Monte a mensagem perfeita para conversão</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("config")} disabled={isCreating} className="border-border/50 h-10 px-6 font-semibold">Voltar</Button>
            <Button 
               onClick={handleActivate}
               disabled={isCreating}
               className="gradient-emerald text-primary-foreground font-bold gap-2 h-10 px-6 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {isCreating ? "Ativando..." : "Ativar Disparo"}
            </Button>
          </div>
        </div>
        <MessageBuilder onChange={setMessageConfig} />
      </div>
    );
  }

  if (loadingCampaigns || loadingInstances) {
     return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
           <Loader2 className="h-10 w-10 animate-spin text-primary" />
           <p className="text-muted-foreground animate-pulse text-sm font-medium">Sincronizando campanhas...</p>
        </div>
     );
  }

  return (
    <div className="space-y-8 max-w-[1400px] animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Campanhas de Disparo</h1>
          <p className="text-sm text-muted-foreground mt-1 text-balance">Crie e gerencie seus envios em massa com alta conversão</p>
        </div>
        <Button className="gradient-emerald text-primary-foreground font-bold gap-2 h-11 px-6 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105" onClick={() => setStep("build")}>
          <Send className="h-5 w-5" /> Criar Campanha
        </Button>
      </div>

      {/* Config Quick View */}
      <div className="glass-card-static p-6 space-y-6">
        <div className="section-header flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
             <Layers className="h-4 w-4 text-primary" /> Configuração Rápida
          </h3>
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-border/30">Passo 1/2</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2.5 block">Nome da Campanha</label>
            <Input 
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Ex: Black Friday 2024" 
               className="bg-secondary/30 border-border/30 h-11 focus-visible:ring-emerald-500/30 font-semibold" 
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2.5 block">Segmentação / Público</label>
            <Select value={listType} onValueChange={setListType}>
              <SelectTrigger className="bg-secondary/30 border-border/30 h-11 focus-visible:ring-emerald-500/30">
                <SelectValue placeholder="Selecione uma lista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Base Geral ({uniqueContactsCount} contatos)</SelectItem>
                <SelectItem value="leads">Leads Novos</SelectItem>
                <SelectItem value="vip">Clientes Recorrentes (VIP)</SelectItem>
                <SelectItem value="manual" className="font-bold text-amber-500 hover:text-amber-600">Lista Manual (Colar/TXT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2.5 block">Instância Conectada</label>
            <Select value={instanceId} onValueChange={setInstanceId}>
              <SelectTrigger className="bg-secondary/30 border-border/30 h-11 focus-visible:ring-emerald-500/30">
                <SelectValue placeholder="Selecione o número" />
              </SelectTrigger>
              <SelectContent>
                {instances.map(inst => (
                   <SelectItem key={inst.id} value={inst.id}>
                      <span className="flex items-center gap-2">
                         <Smartphone className="h-3 w-3 opacity-60" /> {inst.name}
                      </span>
                   </SelectItem>
                ))}
                {instances.length === 0 && <SelectItem value="none" disabled>Nenhuma instância ativa</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2.5 block">Agendamento Opcional</label>
            <div className="flex gap-2">
              <Input 
                type="datetime-local" 
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="bg-secondary/30 border-border/30 h-11 flex-1 text-xs" 
              />
            </div>
          </div>
        </div>

        {/* Bloco de Opções Avançadas e Lista Manual dependendo do estado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
           {listType === "manual" && (
             <div className="animate-fade-in border border-amber-500/20 bg-amber-500/5 rounded-xl p-4">
                <label className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2.5 flex items-center justify-between">
                   <span>Colar Lista de Contatos</span>
                   <span className="text-secondary-foreground/50 text-[9px]">Formato: NÚMERO ou NÚMERO,NOME. Cada um em uma linha.</span>
                </label>
                <textarea
                   value={manualContacts}
                   onChange={e => setManualContacts(e.target.value)}
                   className="w-full bg-background/50 border border-border/40 rounded-lg p-3 text-xs font-mono min-h-[100px] max-h-[200px] resize-y placeholder:text-muted-foreground/30 focus-visible:ring-amber-500/30 outline-none"
                   placeholder="Ex:&#10;5511999999999&#10;5511988888888,João Silva&#10;5511977777777,Maria Santos&#10;..."
                />
             </div>
           )}

           <div className={`animate-fade-in border border-border/20 bg-secondary/10 rounded-xl p-4 flex flex-col justify-center ${listType !== 'manual' ? 'lg:col-span-2' : ''}`}>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 block">Proteção Anti-Ban: Delay de Envio</label>
              <div className="flex items-center gap-6">
                 <div className="flex-1">
                   <span className="text-xs font-semibold mb-1 block">Tempo Mínimo (seg)</span>
                   <Input type="number" min={5} value={delayMin} onChange={e => setDelayMin(Number(e.target.value))} className="bg-background/80" />
                 </div>
                 <div className="flex-1">
                   <span className="text-xs font-semibold mb-1 block">Tempo Máximo (seg)</span>
                   <Input type="number" min={delayMin + 1} value={delayMax} onChange={e => setDelayMax(Number(e.target.value))} className="bg-background/80" />
                 </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 italic">
                 A API sorteará aleatoriamente um valor entre {delayMin} e {delayMax} segundos para cada mensagem enviada, emulando envio humano natural.
              </p>
           </div>
        </div>
        <div className="flex justify-end">
          <Button 
            className="gradient-emerald text-primary-foreground font-bold gap-2 h-11 px-8 shadow-md shadow-emerald-500/20" 
            onClick={() => {
              if (!name) return toast.error("Preencha o nome antes de avançar");
              setStep("build");
            }}
          >
            Avançar para Criativo <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Histórico Operacional
          </h3>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase font-bold tracking-wider px-3 py-1">
            {campaigns.filter(c => c.status === 'PROCESSING').length} Em Andamento
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {campaigns.length === 0 ? (
             <div className="glass-card-static p-20 text-center border-dashed opacity-50">
                <p className="text-muted-foreground italic">Nenhuma campanha registrada no Supabase.</p>
             </div>
          ) : (
            campaigns.map((c, i) => {
              const progress = c.total_numbers > 0 ? ((c.sent_count || 0) / c.total_numbers) * 100 : 0;
              const isProcessing = c.status === "PROCESSING" || c.status === "PENDING";
              
              return (
                <div key={c.id} className="glass-card p-5 group hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner ${
                        isProcessing ? "bg-primary/10" : c.status === "COMPLETED" ? "bg-info/10" : "bg-warning/10"
                      }`}>
                        {isProcessing ? <Send className="h-5 w-5 text-primary animate-pulse" /> :
                         c.status === "COMPLETED" ? <CheckCircle2 className="h-5 w-5 text-info" /> :
                         <Clock className="h-5 w-5 text-warning" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">{c.name}</h4>
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span className="font-semibold text-foreground/70">{format(new Date(c.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span className="font-mono text-[9px]">ID: {c.id.split('-')[0].toUpperCase()}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                      <div className="text-left lg:text-right">
                        <p className="text-sm font-bold text-foreground font-mono">{c.sent_count?.toLocaleString()} <span className="text-muted-foreground font-medium text-xs">/ {c.total_numbers.toLocaleString()}</span></p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5 opacity-60">Status de Envio</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${
                          isProcessing ? "bg-primary/10 text-primary border-primary/20" : 
                          c.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                          "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        } px-4 py-1 font-bold text-[10px] uppercase tracking-wider`}>
                          {c.status === "PROCESSING" ? "Enviando" : c.status === "PENDING" ? "Fila" : c.status === "COMPLETED" ? "Concluído" : "Agendado"}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-40 hover:opacity-100">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-2 lg:pl-16">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      <span>Progresso Instantâneo</span>
                      <span className={isProcessing ? "text-primary flex items-center gap-1" : ""}>
                         {isProcessing && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                         {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/50 overflow-hidden relative border border-border/10">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
                          isProcessing ? "gradient-emerald shadow-[0_0_12px_rgba(37,211,102,0.4)]" : 
                          c.status === "COMPLETED" ? "bg-info" : "bg-warning/40"
                        }`} 
                        style={{ width: `${Math.min(progress, 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

