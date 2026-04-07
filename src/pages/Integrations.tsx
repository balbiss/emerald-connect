import { useState } from "react";
import { Webhook, Key, Copy, Eye, EyeOff, RefreshCw, Plus, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Integrations() {
  const [showKey, setShowKey] = useState(false);
  const apiKey = "zf_live_sk_a1b2c3d4e5f6g7h8i9j0";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("Chave copiada!");
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Integrações</h1>
        <p className="text-sm text-muted-foreground mt-1">Webhooks e chaves de acesso para desenvolvedores</p>
      </div>

      {/* API Key */}
      <div className="glass-card-static p-6 animate-fade-in">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Key className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Chave de API</h3>
            <p className="text-[11px] text-muted-foreground">Autentique chamadas à API do ZapFlow</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input readOnly value={showKey ? apiKey : "•".repeat(32)} className="bg-secondary/30 font-mono text-sm border-border/40 h-10" />
          <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)} className="h-10 w-10 border-border/40 flex-shrink-0">
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={copyKey} className="h-10 w-10 border-border/40 flex-shrink-0">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <p className="text-[11px] text-muted-foreground">Nunca compartilhe esta chave publicamente</p>
        </div>
      </div>

      {/* Webhooks */}
      <div className="glass-card-static p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Webhook className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Webhooks</h3>
              <p className="text-[11px] text-muted-foreground">Receba notificações em tempo real</p>
            </div>
          </div>
          <Button size="sm" className="gradient-emerald text-primary-foreground font-semibold gap-1.5 h-9">
            <Plus className="h-3.5 w-3.5" /> Novo Webhook
          </Button>
        </div>
        <div className="space-y-1">
          {[
            { url: "https://api.meusite.com/webhook/delivery", events: ["message.delivered", "message.read"], active: true },
            { url: "https://api.meusite.com/webhook/status", events: ["instance.connected"], active: false },
          ].map((wh, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-border/10 last:border-0 table-row-hover rounded-lg px-3 -mx-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-foreground">{wh.url}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {wh.events.map((e) => (
                    <span key={e} className="stat-badge stat-badge-neutral text-[10px]">{e}</span>
                  ))}
                </div>
              </div>
              <span className={`stat-badge ${wh.active ? "stat-badge-positive" : "stat-badge-neutral"}`}>
                {wh.active ? "Ativo" : "Inativo"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Code */}
      <div className="glass-card-static p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="section-header mb-4">
          <h3 className="text-sm font-semibold text-foreground">Exemplo de Uso</h3>
        </div>
        <div className="bg-background/80 p-5 rounded-xl border border-border/30 overflow-x-auto">
          <pre className="text-[12px] text-muted-foreground font-mono leading-relaxed">
{`curl -X POST https://api.zapflow.com/v1/messages/send \\
  -H "Authorization: Bearer zf_live_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+5511999991234",
    "type": "text",
    "body": "Olá, {{nome}}!"
  }'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
