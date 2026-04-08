import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PhonePreview } from "@/components/PhonePreview";
import {
  Type, MousePointerClick, GalleryHorizontalEnd, ListChecks, ImagePlus,
  Plus, Trash2, Video, FileText, Mic, CheckCircle2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ButtonItem {
  label: string;
  type: string;
  value: string;
}

interface CarouselCard {
  title: string;
  description: string;
  footer?: string;
  imageUrl: string;
  buttons: { label: string; url: string }[];
}

interface PollOption {
  label: string;
}

interface Poll {
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
}

interface MediaPayload {
  type: "image" | "video" | "document" | "audio";
  url: string;
  caption?: string;
  filename?: string;
  ptt?: boolean; // Para áudio
}

export interface MessagePayload {
  type: "text" | "buttons" | "carousel" | "interactive" | "media";
  text?: string;
  buttons?: ButtonItem[];
  carousel?: CarouselCard[];
  poll?: Poll;
  media?: MediaPayload;
}

interface MessageBuilderProps {
  onChange?: (payload: MessagePayload) => void;
}

export function MessageBuilder({ onChange }: MessageBuilderProps) {
  const [activeTab, setActiveTab] = useState<MessagePayload["type"]>("text");
  
  const [text, setText] = useState("Olá, {{nome}}! 👋\n\nTemos uma oferta especial para você.");
  const [buttons, setButtons] = useState<ButtonItem[]>([
    { label: "Ver Oferta", type: "url", value: "https://exemplo.com" },
  ]);
  const [carousel, setCarousel] = useState<CarouselCard[]>([
    { title: "Produto Premium", description: "O melhor para sua empresa", footer: "Oferta limitada", imageUrl: "", buttons: [{ label: "Comprar", url: "" }] },
    { title: "Plano Enterprise", description: "Escalabilidade total", footer: "Consulte condições", imageUrl: "", buttons: [{ label: "Saber mais", url: "" }] },
  ]);
  const [poll, setPoll] = useState<Poll>({
    question: "Qual sua preferência de contato?",
    options: [{ label: "WhatsApp" }, { label: "E-mail" }],
    allowMultiple: false
  });
  const [media, setMedia] = useState<MediaPayload>({
    type: "image",
    url: "",
    caption: ""
  });

  // Notifica o pai sempre que houver mudanças nos estados ou na aba ativa
  useEffect(() => {
    if (onChange) {
      const payload: MessagePayload = { type: activeTab };
      if (activeTab === "text") payload.text = text;
      if (activeTab === "buttons") { payload.text = text; payload.buttons = buttons; }
      if (activeTab === "carousel") payload.carousel = carousel;
      if (activeTab === "interactive") payload.poll = poll;
      if (activeTab === "media") payload.media = media;
      
      onChange(payload);
    }
  }, [activeTab, text, buttons, carousel, poll, media]);

  const addButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, { label: "", type: "reply", value: "" }]);
    }
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index: number, field: keyof ButtonItem, value: string) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value };
    setButtons(updated);
  };

  const addCard = () => {
    if (carousel.length < 10) {
      setCarousel([...carousel, { title: "", description: "", footer: "", imageUrl: "", buttons: [{ label: "Ação", url: "" }] }]);
    }
  };

  const removeCard = (index: number) => {
    setCarousel(carousel.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    if (poll.options.length < 12) {
      setPoll({ ...poll, options: [...poll.options, { label: "" }] });
    }
  };

  const removePollOption = (index: number) => {
    setPoll({ ...poll, options: poll.options.filter((_, i) => i !== index) });
  };

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...poll.options];
    updatedOptions[index] = { label: value };
    setPoll({ ...poll, options: updatedOptions });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Editor */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold text-foreground mb-4">Construtor de Mensagens</h3>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MessagePayload["type"])}>
          <TabsList className="bg-secondary/50 mb-4 flex-wrap h-auto gap-1 border border-border/30 rounded-xl p-1 shadow-inner">
            <TabsTrigger value="text" className="gap-1.5 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><Type className="h-3.5 w-3.5" /> Texto</TabsTrigger>
            <TabsTrigger value="buttons" className="gap-1.5 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary"><MousePointerClick className="h-3.5 w-3.5" /> Botões</TabsTrigger>
            <TabsTrigger value="carousel" className="gap-1.5 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500"><GalleryHorizontalEnd className="h-3.5 w-3.5" /> Carrossel</TabsTrigger>
            <TabsTrigger value="interactive" className="gap-1.5 text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-500"><ListChecks className="h-3.5 w-3.5" /> Enquete</TabsTrigger>
            <TabsTrigger value="media" className="gap-1.5 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500"><ImagePlus className="h-3.5 w-3.5" /> Mídia</TabsTrigger>
          </TabsList>

          {/* TEXTO */}
          <TabsContent value="text" className="space-y-4 animate-fade-in">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Corpo da mensagem</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="min-h-[140px] bg-secondary/30 border-border/50 resize-y rounded-xl shadow-inner focus-visible:ring-primary/40 focus-visible:border-primary/40"
              />
              <p className="text-[11px] text-muted-foreground mt-2.5">
                Variáveis disponíveis: <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">{"{{nome}}"}</code>, <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold">{"{{telefone}}"}</code>
              </p>
            </div>
          </TabsContent>

          {/* BOTÕES */}
          <TabsContent value="buttons" className="space-y-5 animate-fade-in">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Corpo da mensagem (acima dos botões)</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="min-h-[100px] bg-secondary/30 border-border/50 resize-y rounded-xl focus-visible:ring-primary/40"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm text-foreground flex items-center justify-between">
                <span>Botões de Ação</span>
                <span className="text-xs text-muted-foreground font-normal">{buttons.length}/3</span>
              </Label>
              
              {buttons.map((btn, i) => (
                <div key={i} className="bg-secondary/30 rounded-xl p-4 space-y-3 border border-border/30 shadow-sm relative group hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between absolute right-3 top-3">
                    <button onClick={() => removeButton(i)} className="text-destructive/50 hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3 pr-6">
                    <div>
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/80 mb-1.5 block">Texto do Botão</Label>
                      <Input
                        value={btn.label}
                        onChange={(e) => updateButton(i, "label", e.target.value)}
                        placeholder="Ex: Ver Oferta"
                        className="bg-background/80 h-9 text-sm border-border/50"
                        maxLength={20}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/80 mb-1.5 block">Ação</Label>
                        <Select value={btn.type} onValueChange={(v) => updateButton(i, "type", v)}>
                          <SelectTrigger className="bg-background/80 h-9 text-sm border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reply">Resposta Simples</SelectItem>
                            <SelectItem value="url">Abrir Link</SelectItem>
                            <SelectItem value="call">Ligar</SelectItem>
                            <SelectItem value="copy">Copiar Texto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground/80 mb-1.5 block">Valor (opcional)</Label>
                        <Input
                          value={btn.value}
                          onChange={(e) => updateButton(i, "value", e.target.value)}
                          placeholder={btn.type === "url" ? "https://..." : btn.type === "call" ? "+55..." : ""}
                          disabled={btn.type === "reply"}
                          className="bg-background/80 h-9 text-sm border-border/50 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {buttons.length < 3 && (
                <Button variant="outline" size="sm" onClick={addButton} className="w-full border-dashed h-10 border-border/40 hover:border-primary/50 text-foreground hover:bg-primary/5 transition-colors group">
                  <Plus className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" /> Adicionar Botão de Ação
                </Button>
              )}
            </div>
          </TabsContent>

          {/* CARROSSEL */}
          <TabsContent value="carousel" className="space-y-4 animate-fade-in">
            <p className="text-sm text-muted-foreground font-medium flex justify-between">
              Cards do Carrossel 
              <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">{carousel.length}/10</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carousel.map((card, i) => (
                <div key={i} className="bg-secondary/20 rounded-xl p-4 space-y-3 border border-border/30 hover:border-emerald-500/30 transition-colors relative">
                  <button onClick={() => removeCard(i)} className="absolute right-2 top-2 p-1 text-destructive/40 hover:text-destructive bg-background/50 rounded-lg hover:bg-background/80 transition-colors z-10 hidden md:block group-hover:block">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  
                  <div className="space-y-0.5 text-center bg-background/40 border border-dashed border-border/50 rounded-lg p-3">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Imagem do Card</span>
                    <Input
                        value={card.imageUrl}
                        onChange={(e) => updateCardField(i, "imageUrl", e.target.value)}
                        placeholder="URL da imagem (https://...)"
                        className="bg-background h-8 text-[11px] border-border/20 mt-1.5 focus-visible:ring-emerald-500/30"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Input
                      value={card.title}
                      onChange={(e) => updateCardField(i, "title", e.target.value)}
                      placeholder="Título Principal"
                      className="bg-background/60 h-9 font-semibold text-sm border-border/40 focus-visible:ring-emerald-500/30"
                      maxLength={25}
                    />
                    <Input
                      value={card.description}
                      onChange={(e) => updateCardField(i, "description", e.target.value)}
                      placeholder="Descrição breve"
                      className="bg-background/60 h-9 text-xs border-border/40 focus-visible:ring-emerald-500/30"
                    />
                    <Input
                      value={card.footer}
                      onChange={(e) => updateCardField(i, "footer", e.target.value)}
                      placeholder="Rodapé (opcional)"
                      className="bg-background/60 h-8 text-[11px] italic border-border/40 focus-visible:ring-emerald-500/30"
                    />
                    <div className="pt-2 border-t border-border/30 mt-2">
                       <Input
                         value={card.buttons[0]?.label}
                         onChange={(e) => {
                           const u = [...carousel]; 
                           if(!u[i].buttons[0]) u[i].buttons[0] = {label:"", url:""};
                           u[i].buttons[0].label = e.target.value; 
                           setCarousel(u);
                         }}
                         placeholder="Ação Principal do Botão"
                         className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 placeholder:text-emerald-500/50 h-9 font-medium text-xs text-center focus-visible:ring-emerald-500/40"
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {carousel.length < 10 && (
              <Button variant="outline" size="sm" onClick={addCard} className="w-full border-dashed h-11 border-emerald-500/30 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Card ao Carrossel
              </Button>
            )}
          </TabsContent>

          {/* ENQUETE (POLL) */}
          <TabsContent value="interactive" className="space-y-4 animate-fade-in">
            <div className="bg-secondary/30 rounded-xl p-5 border border-border/30 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">Pergunta Central</Label>
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border/40">
                    <Label htmlFor="multiple-answers" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground cursor-pointer">Requer Múltiplas Escolhas</Label>
                    <Switch 
                       id="multiple-answers"
                       checked={poll.allowMultiple} 
                       onCheckedChange={(v) => setPoll({...poll, allowMultiple: v})} 
                       className="data-[state=checked]:bg-purple-500"
                    />
                  </div>
                </div>
                <Input
                  value={poll.question}
                  onChange={(e) => setPoll({...poll, question: e.target.value})}
                  placeholder="Ex: Qual o melhor horário para entrarmos em contato?"
                  className="bg-background/80 h-11 text-base font-medium shadow-inner border-border/50 focus-visible:ring-purple-500/40"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground flex items-center justify-between">
                   <span>Opções de Voto</span>
                   <span>({poll.options.length}/12)</span>
                </Label>
                {poll.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 items-center group">
                    <div className="w-8 flex-shrink-0 text-center font-mono text-xs text-muted-foreground/50 font-bold bg-background/50 h-10 flex items-center justify-center rounded-lg border border-border/30">
                       {idx + 1}
                    </div>
                    <Input
                      value={opt.label}
                      onChange={(e) => updatePollOption(idx, e.target.value)}
                      placeholder={`Opção descritiva`}
                      className="bg-background/80 h-10 text-sm flex-1 border-border/50 group-hover:border-purple-500/30 transition-colors focus-visible:ring-purple-500/40"
                    />
                    {poll.options.length > 2 && (
                      <Button variant="ghost" size="icon" onClick={() => removePollOption(idx)} className="text-destructive/50 hover:text-destructive hover:bg-destructive/10 h-10 w-10 flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {poll.options.length < 12 && (
                <Button variant="outline" size="sm" onClick={addPollOption} className="w-full border-dashed h-11 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors">
                  <Plus className="h-4 w-4 mr-2" /> Nova Opção
                </Button>
              )}
            </div>
          </TabsContent>

          {/* MIDIA */}
          <TabsContent value="media" className="space-y-5 animate-fade-in">
            <Label className="text-sm text-foreground">Escolha o formato do anexo</Label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "image", icon: ImagePlus, label: "Imagem" },
                { id: "video", icon: Video, label: "Vídeo" },
                { id: "document", icon: FileText, label: "Documento" },
                { id: "audio", icon: Mic, label: "Áudio" }
              ].map((mType) => {
                const Icon = mType.icon;
                const isActive = media.type === mType.id;
                return (
                  <div 
                     key={mType.id} 
                     onClick={() => setMedia({ ...media, type: mType.id as any })}
                     className={cn(
                        "rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all border-2",
                        isActive 
                           ? "border-amber-500 bg-amber-500/10 scale-105 shadow-md shadow-amber-500/10" 
                           : "border-border/40 bg-secondary/20 hover:border-amber-500/40 hover:bg-amber-500/5 text-muted-foreground hover:text-foreground"
                     )}
                  >
                    <Icon className={cn("h-6 w-6", isActive && "text-amber-500")} />
                    <span className="text-xs font-bold uppercase tracking-wider">{mType.label}</span>
                    {isActive && <CheckCircle2 className="h-4 w-4 absolute top-2 right-2 text-amber-500" />}
                  </div>
                )
              })}
            </div>

            <div className="bg-secondary/30 rounded-xl p-5 border border-border/40 space-y-4">
              <div>
                 <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground block mb-1.5">
                    URL do Arquivo {media.type === 'image' && '(JPG/PNG/WEBP)'}{media.type === 'video' && '(MP4)'}
                 </Label>
                 <Input 
                    value={media.url}
                    onChange={(e) => setMedia({...media, url: e.target.value})}
                    placeholder="https://sua-hospedagem.com/arquivo.png" 
                    className="bg-background/80 h-11 font-mono text-xs border-border/50 focus-visible:ring-amber-500/40" 
                 />
              </div>

              {media.type !== 'audio' && (
                <div>
                   <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground block mb-1.5">
                      Legenda Opcional
                   </Label>
                   <Input 
                      value={media.caption || ""}
                      onChange={(e) => setMedia({...media, caption: e.target.value})}
                      placeholder="Texto que aparecerá embaixo da mídia" 
                      className="bg-background/80 h-11 border-border/50 focus-visible:ring-amber-500/40" 
                   />
                </div>
              )}

              {media.type === 'document' && (
                <div>
                   <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground block mb-1.5">
                      Nome do Arquivo (Exibição)
                   </Label>
                   <Input 
                      value={media.filename || ""}
                      onChange={(e) => setMedia({...media, filename: e.target.value})}
                      placeholder="Ex: Contrato_Termos_V2.pdf" 
                      className="bg-background/80 h-11 border-border/50 focus-visible:ring-amber-500/40" 
                   />
                </div>
              )}

              {media.type === 'audio' && (
                <div className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-border/30">
                  <div>
                     <Label className="text-sm font-semibold">Enviar como Áudio Gravado na Hora</Label>
                     <p className="text-[11px] text-muted-foreground">O arquivo de áudio parecerá que foi gravado pelo microfone (PTT).</p>
                  </div>
                  <Switch 
                    checked={media.ptt || false} 
                    onCheckedChange={(checked) => setMedia({...media, ptt: checked})} 
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Phone Preview */}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Preview Mobile</h3>
        <PhonePreview
          message={activeTab === "text" || activeTab === "buttons" ? text : undefined}
          buttons={activeTab === "buttons" ? buttons : undefined}
          carousel={activeTab === "carousel" ? carousel : undefined}
          poll={activeTab === "interactive" ? poll : undefined}
        />
        {(activeTab === "media") && (
           <p className="text-xs text-muted-foreground max-w-[260px] text-center italic">
             O preview de formatos de mídia não está 100% refletido no mockup. Mas a estrutura seguirá o padrão do WhatsApp {media.type}.
           </p>
        )}
      </div>
    </div>
  );

  // Helper para atualizar carousel
  function updateCardField(index: number, field: string, value: string) {
    const u: any = [...carousel];
    u[index][field] = value;
    setCarousel(u);
  }
}

