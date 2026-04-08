import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState({ fullName: "Carregando...", initials: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário";
        const parts = name.split(" ");
        const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
        setProfile({ fullName: name, initials });
      }
    });
  }, []);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border/30 px-4 md:px-6 bg-background/60 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-2 md:gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors h-10 w-10" />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar campanhas, contatos..."
                  className="pl-9 w-72 h-10 bg-secondary/40 border-border/40 text-sm placeholder:text-muted-foreground/50 focus:bg-secondary/60 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </button>
              <div className="h-8 w-px bg-border/40" />
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                  <span className="text-xs font-bold text-primary">{profile.initials || "E"}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-foreground leading-none">{profile.fullName}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Admin</p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
