import {
  LayoutDashboard,
  Smartphone,
  Megaphone,
  Users,
  BarChart3,
  CreditCard,
  Webhook,
  Zap,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Início", url: "/", icon: LayoutDashboard },
  { title: "Minhas Conexões", url: "/connections", icon: Smartphone },
  { title: "Campanhas", url: "/campaigns", icon: Megaphone },
  { title: "Audiência", url: "/audience", icon: Users },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
  { title: "Meu Plano", url: "/plan", icon: CreditCard },
  { title: "Integrações", url: "/integrations", icon: Webhook },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-emerald flex items-center justify-center flex-shrink-0">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-foreground tracking-tight">
              ZapFlow
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="hover:bg-sidebar-accent/50 transition-colors"
                        activeClassName="bg-sidebar-accent text-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Plano Starter</p>
            <p className="text-xs text-primary font-semibold mt-1">1/3 Instâncias</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
