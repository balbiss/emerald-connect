import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    icon: Zap,
    current: true,
    features: ["1 número WhatsApp", "5.000 msgs/mês", "Suporte por email", "Relatórios básicos"],
  },
  {
    name: "Pro",
    price: "R$ 247",
    icon: Crown,
    current: false,
    popular: true,
    features: ["3 números WhatsApp", "25.000 msgs/mês", "Suporte prioritário", "Relatórios avançados", "Carrossel de vendas", "Webhooks"],
  },
  {
    name: "Enterprise",
    price: "R$ 597",
    icon: Rocket,
    current: false,
    features: ["10 números WhatsApp", "Mensagens ilimitadas", "Gerente de conta", "API completa", "White-label", "SLA 99.9%"],
  },
];

export default function Plan() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Plano</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie sua assinatura e limites</p>
      </div>

      {/* Current usage */}
      <div className="glass-card p-5 animate-fade-in">
        <h3 className="text-sm font-medium text-foreground mb-4">Uso Atual — Plano Starter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Instâncias</span>
              <span className="text-foreground font-medium">1 / 1</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Mensagens</span>
              <span className="text-foreground font-medium">3.540 / 5.000</span>
            </div>
            <Progress value={70.8} className="h-2" />
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <div key={i} className={`glass-card p-6 animate-fade-in relative ${plan.popular ? "border-primary/50 glow-emerald" : ""}`} style={{ animationDelay: `${i * 100}ms` }}>
            {plan.popular && (
              <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-0 text-[10px]">
                Mais Popular
              </Badge>
            )}
            <div className="flex items-center gap-2 mb-4">
              <plan.icon className={`h-5 w-5 ${plan.current ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-semibold text-foreground">{plan.name}</h3>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{plan.price}<span className="text-sm text-muted-foreground font-normal">/mês</span></p>
            <ul className="space-y-2 mt-4 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            {plan.current ? (
              <Button variant="outline" className="w-full" disabled>Plano Atual</Button>
            ) : (
              <Button className={`w-full ${plan.popular ? "gradient-emerald text-primary-foreground font-semibold" : ""}`}>
                Fazer Upgrade
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
