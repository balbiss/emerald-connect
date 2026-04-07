import { useState } from "react";
import { Webhook, Key, Copy, Eye, EyeOff, RefreshCw, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Integrations() {
  const [showKey, setShowKey] = useState(false);
  const apiKey = "zf_live_sk_a1b2c3d4e5f6g7h8i9j0";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("Chave copiada!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrações</h1>
        <p className="text-sm text-muted-foreground mt-1">Webhooks e chaves de acesso para desenvolvedores</p>
      </div>

      {/* API Key */}
      <div className="glass-card p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Chave de API</h3>
        </div>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={showKey ? apiKey : "•".repeat(32)}
            className="bg-secondary/30 font-mono text-sm"
          />
          <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)}>
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={copyKey}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-warning">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Use esta chave para autenticar chamadas à API do ZapFlow.</p>
      </div>

      {/* Webhooks */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Webhook className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Webhooks</h3>
          </div>
          <Button size="sm" className="gap-1.5 gradient-emerald text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> Novo Webhook
          </Button>
        </div>
        <div className="space-y-3">
          {[
            { url: "https://api.meusite.com/webhook/delivery", events: ["message.delivered", "message.read"], active: true },
            { url: "https://api.meusite.com/webhook/status", events: ["instance.connected"], active: false },
          ].map((wh, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div>
                <p className="text-sm font-mono text-foreground">{wh.url}</p>
                <div className="flex gap-1 mt-1">
                  {wh.events.map((e) => (
                    <Badge key={e} variant="secondary" className="text-[10px] bg-secondary/50">{e}</Badge>
                  ))}
                </div>
              </div>
              <Badge variant={wh.active ? "default" : "secondary"} className={wh.active ? "bg-primary/20 text-primary border-0 text-xs" : "text-xs"}>
                {wh.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Code example */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="text-sm font-medium text-foreground mb-3">Exemplo de Uso (cURL)</h3>
        <pre className="bg-background/80 p-4 rounded-lg text-xs text-muted-foreground overflow-x-auto font-mono">
{`curl -X POST https://api.zapflow.com/v1/messages/send \\
  -H "Authorization: Bearer ${apiKey.slice(0, 12)}..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+5511999991234",
    "type": "text",
    "body": "Olá, {{nome}}!"
  }'`}
        </pre>
      </div>
    </div>
  );
}
