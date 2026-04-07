import { CheckCheck } from "lucide-react";

interface PhonePreviewProps {
  message?: string;
  buttons?: { label: string; type: string }[];
  carousel?: { title: string; description: string }[];
}

export function PhonePreview({ message, buttons, carousel }: PhonePreviewProps) {
  return (
    <div className="phone-mockup w-[280px] h-[560px] mx-auto">
      <div className="phone-notch" />
      {/* Status bar */}
      <div className="relative overflow-hidden px-4 pt-8 pb-3 flex items-center gap-3"
        style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 65% 25%))" }}>
        <div className="h-9 w-9 rounded-full bg-[rgba(255,255,255,0.15)] flex items-center justify-center backdrop-blur-sm">
          <span className="text-xs font-bold text-[rgba(255,255,255,0.95)]">ZF</span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[rgba(255,255,255,0.95)]">ZapFlow Bot</p>
          <p className="text-[10px] text-[rgba(255,255,255,0.6)]">online</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 h-[calc(100%-120px)] overflow-y-auto p-3 space-y-2"
        style={{
          backgroundColor: "#0b141a",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}>

        {message && (
          <div className="max-w-[85%] ml-auto">
            <div className="rounded-lg rounded-tr-sm p-2.5" style={{ backgroundColor: "#005c4b" }}>
              <p className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.92)" }}>{message}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>14:32</span>
                <CheckCheck className="h-3 w-3" style={{ color: "hsl(199 89% 60%)" }} />
              </div>
            </div>
          </div>
        )}

        {buttons && buttons.length > 0 && (
          <div className="max-w-[85%] ml-auto space-y-1">
            {buttons.map((btn, i) => (
              <div key={i} className="rounded-lg p-2 text-center" style={{ backgroundColor: "rgba(0,92,75,0.5)", border: "1px solid rgba(83,177,220,0.2)" }}>
                <span className="text-[11px] font-medium" style={{ color: "hsl(199 89% 65%)" }}>{btn.label || "Botão"}</span>
              </div>
            ))}
          </div>
        )}

        {carousel && carousel.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {carousel.map((card, i) => (
              <div key={i} className="min-w-[170px] rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: "#1f2c34" }}>
                <div className="h-20 flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Imagem {i+1}</span>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>{card.title || `Card ${i+1}`}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{card.description || "Descrição"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!message && !buttons?.length && !carousel?.length && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Monte sua mensagem ao lado</p>
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
