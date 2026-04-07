import {
  LayoutDashboard,
  Smartphone,
  Megaphone,
  Users,
  BarChart3,
  CreditCard,
  Webhook,
  Zap,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const mainNav = [
  { title: "Início", url: "/", icon: LayoutDashboard },
  { title: "Minhas Conexões", url: "/connections", icon: Smartphone },
  { title: "Campanhas", url: "/campaigns", icon: Megaphone },
  { title: "Audiência", url: "/audience", icon: Users },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
];

const configNav = [
  { title: "Meu Plano", url: "/plan", icon: CreditCard },
  { title: "Integrações", url: "/integrations", icon: Webhook },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  const renderNavItem = (item: typeof mainNav[0]) => {
    const active = isActive(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={active}>
          <NavLink
            to={item.url}
            end={item.url === "/"}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              active
                ? "nav-item-active text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
            }`}
            activeClassName=""
          >
            <item.icon className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
            {!collapsed && (
              <span className="text-[13px] tracking-wide">{item.title}</span>
            )}
            {active && !collapsed && (
              <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/30">
      <SidebarHeader className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl gradient-emerald flex items-center justify-center flex-shrink-0 shadow-lg">
            <Zap className="h-[18px] w-[18px] text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-base font-bold text-foreground tracking-tight">
                ZapFlow
              </span>
              <span className="text-[10px] text-primary font-semibold ml-1.5 bg-primary/10 px-1.5 py-0.5 rounded">
                PRO
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60 font-semibold px-3 mb-1">
              Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNav.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && <Separator className="mx-3 my-3 bg-border/30" />}

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60 font-semibold px-3 mb-1">
              Configurações
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {configNav.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        {!collapsed && (
          <div className="glass-card-highlight p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-foreground">Plano Starter</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full gradient-emerald" style={{ width: "33%" }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">1 de 3 instâncias</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
