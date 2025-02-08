import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AIInsights from './pages/AIInsights';
import AIAssistant from './pages/AIAssistant';
import CampaignsPage from './pages/CampaignsPage';
import AIWorkflows from './pages/AIWorkflows';
import WorkflowDetails from './pages/WorkflowDetails';
import AIAgents from './pages/AIAgents';
import AgentCustomization from './pages/AgentCustomization';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Index />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/ai-agents" element={<AIAgents />} />
            <Route path="/campaign-strategist/customize" element={<AgentCustomization />} />
            <Route path="/ai-workflows" element={<AIWorkflows />} />
            <Route path="/ai-workflows/:id" element={<WorkflowDetails />} />
            <Route path="/agents/:id/customize" element={<AgentCustomization />} />
            <Route path="/content-library" element={<div className="p-8">Content Library Page</div>} />
            <Route path="/budget" element={<div className="p-8">Budget Page</div>} />
            <Route path="/performance" element={<div className="p-8">Performance Page</div>} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/insights" element={<div className="p-8">Insights Page</div>} />
            <Route path="/calendar" element={<div className="p-8">Calendar Page</div>} />
            <Route path="/settings" element={<div className="p-8">Settings Page</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
