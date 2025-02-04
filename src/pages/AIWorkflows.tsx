import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Activity, BarChart, ChevronRight, Home, HelpCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress"

interface WorkflowTemplate {
  id: string;
  name: string;
  activeInstances: number;
  successRate: number;
  completedCount: number;
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: '1',
    name: 'Setup and Launch Traffic Campaigns',
    activeInstances: 5,
    successRate: 85,
    completedCount: 150
  },
  {
    id: '2',
    name: 'Social Media Automation',
    activeInstances: 3,
    successRate: 92,
    completedCount: 230
  }
];

interface WorkflowCardProps {
  workflow: WorkflowTemplate;
}

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-[#1A0B2E]/80 border-[#6D28D9]/20 backdrop-blur-xl hover:bg-[#1A0B2E] transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg text-purple-200">{workflow.name}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">{workflow.activeInstances} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-200">{workflow.successRate}% Success Rate</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-300/80">Successfully Completed:</span>
            <span className="text-sm font-medium text-purple-200">{workflow.completedCount}</span>
          </div>
          <Button 
            onClick={() => navigate(`/ai-workflows/${workflow.id}`)}
            className="bg-[#2D1B69] hover:bg-[#3D2B79] text-purple-200"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Run Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AIWorkflows() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]">
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-sm text-purple-300/80 hover:text-purple-200"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-purple-300/60" />
                  <span className="ml-1 text-sm text-purple-200 md:ml-2">
                    AI Workflows
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 mb-2">
              AI Workflows
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-purple-300/80">Manage and monitor your AI-powered workflows</p>
              <Button
                variant="ghost"
                className="bg-[#2D1B69]/40 hover:bg-[#2D1B69] text-purple-200 border border-purple-500/20 backdrop-blur-sm"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Don't know where to start?
              </Button>
            </div>
          </div>

          {/* Workflow Templates Grid */}
          <div className="space-y-4">
            {workflowTemplates.map((template) => (
              <WorkflowCard 
                key={template.id} 
                workflow={template} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
