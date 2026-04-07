import { Check, Zap, Crown, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    features: ["10 números WhatsApp", "Msgs ilimitadas", "Gerente de conta", "API completa", "White-label", "SLA 99.9%"],
  },
];

export default function Plan() {
  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Meu Plano</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie sua assinatura e limites</p>
      </div>

      {/* Current usage */}
      <div className="glass-card-static p-6 animate-fade-in">
        <div className="section-header mb-5">
          <h3 className="text-sm font-semibold text-foreground">Uso do Plano Starter</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Instâncias</span>
              <span className="text-foreground font-bold">1 / 1</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-warning" style={{ width: "100%" }} />
            </div>
            <p className="text-[10px] text-warning mt-1.5 font-medium">Limite atingido</p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Mensagens</span>
              <span className="text-foreground font-bold">3.540 / 5.000</span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full gradient-emerald" style={{ width: "70.8%" }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">29.2% restante</p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative p-7 rounded-2xl animate-fade-in transition-all ${
              plan.popular
                ? "glass-card-highlight glow-emerald"
                : plan.current
                ? "glass-card-static border-primary/10"
                : "glass-card"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="gradient-emerald text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Mais Popular
                </span>
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="stat-badge stat-badge-neutral text-[10px] font-bold uppercase tracking-wider">
                  Plano Atual
                </span>
              </div>
            )}

            <div className="flex items-center gap-2.5 mb-5 mt-1">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${plan.popular ? "gradient-emerald" : "bg-secondary/50"}`}>
                <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
            </div>

            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {plan.price}
              <span className="text-sm text-muted-foreground font-normal tracking-normal">/mês</span>
            </p>

            <ul className="space-y-3 mt-6 mb-7">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? "bg-primary/20" : "bg-secondary/50"}`}>
                    <Check className={`h-2.5 w-2.5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            {plan.current ? (
              <Button variant="outline" className="w-full border-border/50" disabled>Plano Atual</Button>
            ) : (
              <Button className={`w-full gap-2 font-semibold ${plan.popular ? "gradient-emerald text-primary-foreground" : "bg-secondary/50 hover:bg-secondary/80 text-foreground"}`}>
                Fazer Upgrade <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
