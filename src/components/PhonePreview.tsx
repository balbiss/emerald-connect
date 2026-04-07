import { Check, CheckCheck } from "lucide-react";

interface PhonePreviewProps {
  message?: string;
  buttons?: { label: string; type: string }[];
  carousel?: { title: string; description: string }[];
  mediaType?: string;
}

export function PhonePreview({ message, buttons, carousel }: PhonePreviewProps) {
  return (
    <div className="phone-mockup w-[280px] h-[560px] mx-auto">
      <div className="phone-notch" />
      {/* Status bar */}
      <div className="bg-emerald/90 px-4 pt-8 pb-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-emerald-foreground/20 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">ZF</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-foreground">ZapFlow Bot</p>
          <p className="text-[10px] text-primary-foreground/70">online</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="bg-[#0b141a] flex-1 h-[calc(100%-120px)] overflow-y-auto p-3 space-y-2"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>

        {/* Message bubble */}
        {message && (
          <div className="max-w-[85%] ml-auto">
            <div className="bg-[#005c4b] rounded-lg rounded-tr-sm p-2.5">
              <p className="text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">{message}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-foreground/50">14:32</span>
                <CheckCheck className="h-3 w-3 text-info" />
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        {buttons && buttons.length > 0 && (
          <div className="max-w-[85%] ml-auto space-y-1">
            {buttons.map((btn, i) => (
              <div key={i} className="bg-[#005c4b]/60 rounded-lg p-2 text-center border border-info/20">
                <span className="text-xs text-info font-medium">{btn.label || "Botão"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Carousel preview */}
        {carousel && carousel.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {carousel.map((card, i) => (
              <div key={i} className="min-w-[180px] bg-[#1f2c34] rounded-lg overflow-hidden flex-shrink-0">
                <div className="h-20 bg-muted/20 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">Imagem {i+1}</span>
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-foreground">{card.title || `Card ${i+1}`}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{card.description || "Descrição"}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!message && !buttons?.length && !carousel?.length && (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px] text-muted-foreground/50">Monte sua mensagem ao lado</p>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5">
          <span className="text-[11px] text-muted-foreground/40">Mensagem</span>
        </div>
        <div className="h-8 w-8 rounded-full gradient-emerald flex items-center justify-center flex-shrink-0">
          <svg className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  );
}
