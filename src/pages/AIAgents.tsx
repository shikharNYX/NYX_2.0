import React from 'react';
import { Activity, BarChart3, BrainCircuit, Target, Users, Workflow, GitBranch, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface AgentStats {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  workflowStages: string[];  // Stages in the workflow where this agent operates
  capabilities: string[];    // Specific capabilities within workflows
  activeWorkflows: number;   // Number of workflows this agent is currently part of
  avgCompletionTime: string; // Average time to complete its workflow tasks
}

const agents: AgentStats[] = [
  {
    id: '1',
    name: 'Campaign Strategist',
    description: 'Orchestrates the initial campaign planning phase, defining strategy and resource allocation across marketing channels.',
    icon: <Target className="w-6 h-6 text-purple-400" />,
    workflowStages: ['Campaign Planning', 'Strategy Definition', 'Resource Allocation'],
    capabilities: ['Channel Strategy', 'Budget Planning', 'Campaign Goals Definition'],
    activeWorkflows: 12,
    avgCompletionTime: '45 mins'
  },
  {
    id: '2',
    name: 'Content Generator',
    description: 'Handles content creation stages in campaign workflows, generating and adapting content for multiple platforms.',
    icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
    workflowStages: ['Content Creation', 'Creative Review', 'Asset Generation'],
    capabilities: ['Ad Copy Generation', 'Visual Direction', 'Content Adaptation'],
    activeWorkflows: 18,
    avgCompletionTime: '30 mins'
  },
  {
    id: '3',
    name: 'Analytics Expert',
    description: 'Manages performance tracking stages, providing insights for workflow optimization and campaign adjustments.',
    icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
    workflowStages: ['Performance Analysis', 'Optimization Review', 'Results Reporting'],
    capabilities: ['KPI Tracking', 'Performance Insights', 'Optimization Recommendations'],
    activeWorkflows: 15,
    avgCompletionTime: '20 mins'
  },
  {
    id: '4',
    name: 'Audience Analyst',
    description: 'Operates in targeting phases of workflows, defining and refining audience segments for campaigns.',
    icon: <Users className="w-6 h-6 text-purple-400" />,
    workflowStages: ['Audience Definition', 'Targeting Setup', 'Segment Review'],
    capabilities: ['Segment Creation', 'Audience Insights', 'Targeting Rules'],
    activeWorkflows: 10,
    avgCompletionTime: '25 mins'
  },
  {
    id: '5',
    name: 'Performance Optimizer',
    description: 'Executes optimization stages in campaign workflows, implementing real-time adjustments based on performance.',
    icon: <Activity className="w-6 h-6 text-purple-400" />,
    workflowStages: ['Campaign Monitoring', 'Performance Optimization', 'Budget Adjustment'],
    capabilities: ['Real-time Optimization', 'A/B Test Management', 'Resource Reallocation'],
    activeWorkflows: 14,
    avgCompletionTime: '15 mins'
  }
];

const AIAgents = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCustomize = (agent: AgentStats) => {
    navigate(`/agents/${agent.id}/customize`, { state: { agent } });
  };

  return (
    <div className={cn(
      "min-h-screen p-8",
      isDark ? "bg-[#0F0225] text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={cn(
            "text-3xl font-bold",
            isDark ? "text-purple-100" : "text-gray-900"
          )}>NYX AI Agents</h1>
          <p className={cn(
            "mt-2",
            isDark ? "text-purple-300/70" : "text-gray-600"
          )}>
            Workflow-integrated AI agents for automated campaign management
          </p>
        </div>

        {/* Agents List */}
        <div className="space-y-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={cn(
                "rounded-lg p-6 transition-colors",
                isDark 
                  ? "bg-[#1A0B2E] border border-[#6D28D9]/20 hover:border-[#6D28D9]/40"
                  : "bg-white border border-gray-200 hover:border-purple-200 shadow-sm"
              )}
            >
              <div className="flex items-start gap-6">
                <div className={cn(
                  "p-3 rounded-lg",
                  isDark ? "bg-[#2D1B69]/30" : "bg-purple-50"
                )}>
                  {React.cloneElement(agent.icon as React.ReactElement, {
                    className: cn(
                      "w-6 h-6",
                      isDark ? "text-purple-400" : "text-purple-600"
                    )
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className={cn(
                        "text-lg font-semibold",
                        isDark ? "text-purple-100" : "text-gray-900"
                      )}>{agent.name}</h3>
                      <div className={cn(
                        "flex items-center gap-2 px-2 py-1 rounded-md",
                        isDark 
                          ? "bg-[#2D1B69]/30 border border-[#6D28D9]/20"
                          : "bg-purple-50 border border-purple-100"
                      )}>
                        <GitBranch className={cn(
                          "w-4 h-4",
                          isDark ? "text-purple-400" : "text-purple-600"
                        )} />
                        <span className={cn(
                          "text-sm",
                          isDark ? "text-purple-300/70" : "text-gray-600"
                        )}>{agent.activeWorkflows} active workflows</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "transition-all duration-300 hover:scale-105",
                        isDark 
                          ? "bg-gradient-to-r from-[#2D1B69]/50 to-[#6D28D9]/50 hover:from-[#2D1B69] hover:to-[#6D28D9] text-purple-100 border-[#6D28D9]/40 hover:border-[#6D28D9]"
                          : "bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-900 border-purple-200 hover:border-purple-300"
                      )}
                      onClick={() => agent.name === "Campaign Strategist" ? navigate("/campaign-strategist/customize") : handleCustomize(agent)}
                    >
                      <Settings className={cn(
                        "w-4 h-4 mr-2 animate-pulse",
                        isDark ? "text-purple-200" : "text-purple-600"
                      )} />
                      Customize Agent
                    </Button>
                  </div>

                  <p className={cn(
                    "text-sm mb-3",
                    isDark ? "text-purple-300/70" : "text-gray-600"
                  )}>
                    {agent.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {agent.workflowStages.map((stage, index) => (
                        <span
                          key={index}
                          className={cn(
                            "text-xs px-2 py-1 rounded-md",
                            isDark 
                              ? "bg-[#2D1B69]/30 text-purple-300 border border-[#6D28D9]/20"
                              : "bg-purple-50 text-purple-700 border border-purple-100"
                          )}
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className={cn(
                            "text-xs px-2 py-1 rounded-md",
                            isDark 
                              ? "bg-[#2D1B69]/30 text-purple-300 border border-[#6D28D9]/20"
                              : "bg-purple-50 text-purple-700 border border-purple-100"
                          )}
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAgents;
