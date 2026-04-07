import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhonePreview } from "@/components/PhonePreview";
import {
  Type, MousePointerClick, GalleryHorizontalEnd, ListChecks, ImagePlus,
  Plus, Trash2, Link, Phone, Copy
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export function MessageBuilder() {
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
  const [activeTab, setActiveTab] = useState("text");

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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary/50 mb-4 flex-wrap h-auto gap-1">
            <TabsTrigger value="text" className="gap-1.5 text-xs"><Type className="h-3.5 w-3.5" /> Texto</TabsTrigger>
            <TabsTrigger value="buttons" className="gap-1.5 text-xs"><MousePointerClick className="h-3.5 w-3.5" /> Botões</TabsTrigger>
            <TabsTrigger value="carousel" className="gap-1.5 text-xs"><GalleryHorizontalEnd className="h-3.5 w-3.5" /> Carrossel</TabsTrigger>
            <TabsTrigger value="interactive" className="gap-1.5 text-xs"><ListChecks className="h-3.5 w-3.5" /> Interativo</TabsTrigger>
            <TabsTrigger value="media" className="gap-1.5 text-xs"><ImagePlus className="h-3.5 w-3.5" /> Mídia</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Corpo da mensagem</label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="min-h-[140px] bg-secondary/30 border-border/50 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Use <code className="text-primary bg-primary/10 px-1 rounded">{"{{nome}}"}</code>,{" "}
                <code className="text-primary bg-primary/10 px-1 rounded">{"{{telefone}}"}</code> para personalização
              </p>
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-4">
            <p className="text-sm text-muted-foreground">Adicione até 3 botões de ação.</p>
            {buttons.map((btn, i) => (
              <div key={i} className="bg-secondary/30 rounded-lg p-3 space-y-2 border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Botão {i + 1}</span>
                  <button onClick={() => removeButton(i)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Input
                  value={btn.label}
                  onChange={(e) => updateButton(i, "label", e.target.value)}
                  placeholder="Texto do botão"
                  className="bg-background/50 h-9 text-sm"
                />
                <Select value={btn.type} onValueChange={(v) => updateButton(i, "type", v)}>
                  <SelectTrigger className="bg-background/50 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reply">Resposta Rápida</SelectItem>
                    <SelectItem value="url">Link Externo</SelectItem>
                    <SelectItem value="call">Ligar</SelectItem>
                    <SelectItem value="copy">Copiar Código/PIX</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={btn.value}
                  onChange={(e) => updateButton(i, "value", e.target.value)}
                  placeholder={btn.type === "url" ? "https://..." : btn.type === "call" ? "+5511..." : "Valor"}
                  className="bg-background/50 h-9 text-sm"
                />
              </div>
            ))}
            {buttons.length < 3 && (
              <Button variant="outline" size="sm" onClick={addButton} className="w-full border-dashed">
                <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Botão
              </Button>
            )}
          </TabsContent>

          <TabsContent value="carousel" className="space-y-4">
            <p className="text-sm text-muted-foreground">Crie até 10 cards deslizantes.</p>
            {carousel.map((card, i) => (
              <div key={i} className="bg-secondary/30 rounded-lg p-3 space-y-2 border border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Card {i + 1}</span>
                  <button onClick={() => removeCard(i)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                     <div className="h-24 bg-background/30 rounded-lg border border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <div className="text-center">
                        <ImagePlus className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                        <span className="text-[10px] text-muted-foreground">Upload imagem</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={card.title}
                      onChange={(e) => {
                        const u = [...carousel]; u[i] = { ...u[i], title: e.target.value }; setCarousel(u);
                      }}
                      placeholder="Título do card (Negrito)"
                      className="bg-background/50 h-11 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={card.description}
                      onChange={(e) => {
                        const u = [...carousel]; u[i] = { ...u[i], description: e.target.value }; setCarousel(u);
                      }}
                      placeholder="Descrição do card"
                      className="bg-background/50 h-11 text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={card.footer}
                      onChange={(e) => {
                        const u = [...carousel]; u[i] = { ...u[i], footer: e.target.value }; setCarousel(u);
                      }}
                      placeholder="Rodapé (opcional)"
                      className="bg-background/50 h-11 text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={card.buttons[0].label}
                      onChange={(e) => {
                        const u = [...carousel]; u[i].buttons[0].label = e.target.value; setCarousel(u);
                      }}
                      placeholder="Texto do Botão"
                      className="bg-background/50 h-11 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            {carousel.length < 10 && (
              <Button variant="outline" size="sm" onClick={addCard} className="w-full border-dashed">
                <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Card ({carousel.length}/10)
              </Button>
            )}
          </TabsContent>

          <TabsContent value="interactive" className="space-y-4">
            <div className="bg-secondary/30 rounded-lg p-5 border border-border/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Configuração da Enquete</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase text-muted-foreground">Múltiplas Escolhas</span>
                  <Switch checked={poll.allowMultiple} onCheckedChange={(v) => setPoll({...poll, allowMultiple: v})} />
                </div>
              </div>
              <Input
                value={poll.question}
                onChange={(e) => setPoll({...poll, question: e.target.value})}
                placeholder="Pergunta da enquete"
                className="bg-background/50 h-11 text-sm"
              />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Opções ({poll.options.length}/12)</Label>
                {poll.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={opt.label}
                      onChange={(e) => updatePollOption(idx, e.target.value)}
                      placeholder={`Opção ${idx + 1}`}
                      className="bg-background/50 h-11 text-sm flex-1"
                    />
                    {poll.options.length > 2 && (
                      <Button variant="ghost" size="icon" onClick={() => removePollOption(idx)} className="text-destructive h-11 w-11">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {poll.options.length < 12 && (
                <Button variant="outline" size="sm" onClick={addPollOption} className="w-full border-dashed h-11">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Opção
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {["Imagem", "Vídeo", "Documento", "Áudio"].map((type) => (
                <div key={type} className="bg-secondary/30 rounded-lg p-6 border border-dashed border-border/50 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 transition-colors">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{type}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Phone Preview */}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">Preview Mobile</h3>
          <PhonePreview
            message={activeTab === "text" ? text : undefined}
            buttons={activeTab === "buttons" || activeTab === "text" ? buttons : undefined}
            carousel={activeTab === "carousel" ? carousel : undefined}
            poll={activeTab === "interactive" ? poll : undefined}
          />
      </div>
    </div>
  );
}
