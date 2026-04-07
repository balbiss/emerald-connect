import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Mail, Lock, User, Smartphone, Check, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const plans = [
  {
    id: "start",
    name: "Starter",
    price: "R$ 47",
    instances: "1 Instância",
    features: ["Suporte Básico", "Relatórios Diários"],
    color: "slate",
  },
  {
    id: "pro",
    name: "Profissional",
    price: "R$ 97",
    instances: "5 Instâncias",
    features: ["Suporte Prioritário", "API Ilimitada", "Webhooks"],
    popular: true,
    color: "emerald",
  },
  {
    id: "business",
    name: "Business",
    price: "R$ 197",
    instances: "10 Instâncias",
    features: ["Account Manager", "Whitelabel Full", "SLA 99.9%"],
    color: "blue",
  },
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            whatsapp: formData.whatsapp,
          },
        },
      });

      if (error) throw error;

      toast.success("Conta criada! Verifique seu e-mail.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-[900px] z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-emerald mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Crie seu Ambiente</h1>
          <p className="text-muted-foreground">Escalabilidade profissional para o seu negócio de mensagens.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 shadow-2xl border-white/5 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Seus Dados
              </h2>
              <form onSubmit={handleRegister} id="register-form" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Nome Completo</label>
                  <Input placeholder="John Doe" required className="bg-secondary/40 border-border/40 h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">E-mail Corporativo</label>
                  <Input type="email" placeholder="john@empresa.com" required className="bg-secondary/40 border-border/40 h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">WhatsApp (com DDD)</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="5511999999999" required className="bg-secondary/40 border-border/40 h-11 pl-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Senha Mestra</label>
                  <Input type="password" placeholder="••••••••" required className="bg-secondary/40 border-border/40 h-11 font-mono" />
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <Checkbox id="terms" required className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <label htmlFor="terms" className="text-[11px] leading-relaxed text-muted-foreground">
                    Eu aceito os <button type="button" className="text-primary hover:underline font-bold">Termos de Uso</button> e a política de privacidade.
                  </label>
                </div>
              </form>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Já possui acesso?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">Entre aqui</Link>
            </p>
          </div>

          {/* Plans Side */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 ml-1">
              <ShieldCheck className="h-4 w-4 text-primary" /> Escolha seu Plano
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plans.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`
                    relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col h-full
                    ${selectedPlan === p.id 
                      ? "bg-secondary/60 border-primary shadow-[0_0_20px_rgba(37,211,102,0.1)] ring-1 ring-primary/20" 
                      : "glass-card border-white/5 hover:border-white/10 hover:bg-secondary/30"}
                  `}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">
                      Popular
                    </span>
                  )}
                  
                  <div className="mb-4">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${selectedPlan === p.id ? "text-primary" : "text-muted-foreground"}`}>
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-white">{p.price}</span>
                      <span className="text-[10px] text-muted-foreground">/mês</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2">
                       <Check className={`h-3 w-3 ${selectedPlan === p.id ? "text-primary" : "text-muted-foreground"}`} />
                       <span className="text-[11px] font-bold text-foreground">{p.instances}</span>
                    </div>
                    {p.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-3 w-3 mt-0.5 text-muted-foreground/40" />
                        <span className="text-[10px] text-muted-foreground leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-4 pt-4 border-t ${selectedPlan === p.id ? "border-primary/20" : "border-white/5"}`}>
                     <div className={`
                       h-8 flex items-center justify-center rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors
                       ${selectedPlan === p.id ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"}
                     `}>
                       {selectedPlan === p.id ? "Selecionado" : "Selecionar"}
                     </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button 
                form="register-form"
                className="w-full h-11 gradient-emerald text-white font-bold text-sm shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] transition-all group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Concluir Configuração <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              <p className="mt-4 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Pagamento processado de forma segura e criptografada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
