import { CheckCheck, Smartphone } from "lucide-react";

interface PhonePreviewProps {
  message?: string;
  buttons?: { label: string; type: string }[];
  carousel?: { title: string; description: string; footer?: string; buttons: { label: string }[] }[];
  poll?: { question: string; options: { label: string }[]; allowMultiple: boolean };
}

export function PhonePreview({ message, buttons, carousel, poll }: PhonePreviewProps) {
  return (
    <div className="phone-mockup w-[280px] h-[560px] mx-auto">
      <div className="phone-notch" />
      {/* Status bar */}
      <div className="relative overflow-hidden px-4 pt-8 pb-3 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 65% 25%))" }}>
        <div className="h-9 w-9 rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center backdrop-blur-sm">
          <span className="text-xs font-bold text-[rgba(255,255,255,0.95)]">EC</span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[rgba(255,255,255,0.95)]">Emerald Connect</p>
          <p className="text-[10px] text-[rgba(255,255,255,0.6)]">online</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 h-[calc(100%-120px)] overflow-y-auto p-3 space-y-3 enterprise-scroll"
        style={{
          backgroundColor: "#0b141a",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}>

        {message && (
          <div className="max-w-[90%] ml-auto">
            <div className="rounded-lg rounded-tr-sm p-3 shadow-md" style={{ backgroundColor: "#005c4b" }}>
              <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.92)" }}>{message}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>14:32</span>
                <CheckCheck className="h-3 w-3" style={{ color: "hsl(199 89% 60%)" }} />
              </div>
            </div>
          </div>
        )}

        {buttons && buttons.length > 0 && (
          <div className="max-w-[90%] ml-auto space-y-1">
            {buttons.map((btn, i) => (
              <div key={i} className="rounded-lg p-2.5 text-center shadow-sm" style={{ backgroundColor: "#1f2c34", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[12px] font-medium" style={{ color: "hsl(199 89% 65%)" }}>{btn.label || "Botão"}</span>
              </div>
            ))}
          </div>
        )}

        {carousel && carousel.length > 0 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x enterprise-scroll">
            {carousel.map((card, i) => (
              <div key={i} className="min-w-[190px] rounded-xl overflow-hidden flex-shrink-0 shadow-lg snap-center" style={{ backgroundColor: "#1f2c34" }}>
                <div className="h-24 flex items-center justify-center bg-zinc-800/50">
                  <span className="text-[10px] text-muted-foreground/50">Mídia / Imagem</span>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.95)" }}>{card.title || `Card ${i+1}`}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>{card.description || "Descrição do item"}</p>
                  {card.footer && <p className="text-[10px] italic pt-1 border-t border-white/5 mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>{card.footer}</p>}
                </div>
                <div className="border-t border-white/5 p-2 text-center bg-white/5 hover:bg-white/10 transition-colors">
                   <span className="text-[11px] font-semibold text-primary">{card.buttons?.[0]?.label || "Ação"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {poll && (
          <div className="max-w-[90%] ml-auto">
            <div className="rounded-xl p-4 space-y-4 shadow-xl" style={{ backgroundColor: "#1f2c34", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-white">{poll.question || "Pergunta?"}</p>
                <p className="text-[10px] text-muted-foreground">{poll.allowMultiple ? "Selecione uma ou mais" : "Selecione uma opção"}</p>
              </div>
              <div className="space-y-2">
                {poll.options.map((opt, i) => (
                  <div key={i} className="group relative flex items-center justify-between p-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all">
                    <span className="text-[12px] text-white/90">{opt.label || `Opção ${i+1}`}</span>
                    <div className="h-4 w-4 rounded-full border-2 border-white/20 group-hover:border-primary/50" />
                  </div>
                ))}
              </div>
              <div className="pt-2 text-center">
                <span className="text-[11px] font-bold text-primary uppercase tracking-tight">Votar</span>
              </div>
            </div>
          </div>
        )}

        {!message && !buttons?.length && !carousel?.length && !poll && (
          <div className="flex items-center justify-center h-full opacity-20">
            <div className="text-center">
              <Smartphone className="h-10 w-10 mx-auto mb-2" />
              <p className="text-[11px]">Selecione um tipo de mensagem</p>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: "#1f2c34" }}>
        <div className="flex-1 rounded-full px-3 py-1.5" style={{ backgroundColor: "#2a3942" }}>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>Mensagem</span>
        </div>
        <div className="h-8 w-8 rounded-full gradient-emerald flex items-center justify-center flex-shrink-0">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: "white" }}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  );
}
