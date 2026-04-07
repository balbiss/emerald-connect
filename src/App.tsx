import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Connections from "./pages/Connections";
import Campaigns from "./pages/Campaigns";
import Audience from "./pages/Audience";
import Reports from "./pages/Reports";
import Plan from "./pages/Plan";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/connections" element={<DashboardLayout><Connections /></DashboardLayout>} />
          <Route path="/campaigns" element={<DashboardLayout><Campaigns /></DashboardLayout>} />
          <Route path="/audience" element={<DashboardLayout><Audience /></DashboardLayout>} />
          <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
          <Route path="/plan" element={<DashboardLayout><Plan /></DashboardLayout>} />
          <Route path="/integrations" element={<DashboardLayout><Integrations /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
