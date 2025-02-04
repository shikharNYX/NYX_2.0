import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, BrainCircuit, Workflow, Settings2, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import '@/components/ui/custom-switch.css';

const AgentCustomization = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    temperature: 0.5,
    maxTokens: 2048,
    autoOptimize: true,
    parallelExecution: false,
    notifyOnCompletion: true,
    reviewRequired: true
  });

  const setCreativityLevel = (level: 'low' | 'medium' | 'high') => {
    const temperatures = {
      low: 0.3,
      medium: 0.5,
      high: 0.7
    };
    setSettings({ ...settings, temperature: temperatures[level] });
  };

  const [capabilities, setCapabilities] = useState([
    {
      id: 1,
      name: "Campaign Strategy Development",
      description: "Create data-driven marketing strategies",
      enabled: true,
      tools: ["Market Analysis", "Competitor Research", "Trend Analysis"],
      customInstructions: ""
    },
    {
      id: 2,
      name: "Content Creation",
      description: "Generate engaging marketing content",
      enabled: true,
      tools: ["Copywriting", "Visual Design", "A/B Testing"],
      customInstructions: ""
    },
    {
      id: 3,
      name: "Market Analysis",
      description: "Analyze market trends and opportunities",
      enabled: true,
      tools: ["Data Analytics", "Market Research", "Trend Forecasting"],
      customInstructions: ""
    },
    {
      id: 4,
      name: "Budget Optimization",
      description: "Optimize campaign budget allocation",
      enabled: true,
      tools: ["ROI Analysis", "Cost Optimization", "Performance Tracking"],
      customInstructions: ""
    },
    {
      id: 5,
      name: "Performance Tracking",
      description: "Monitor and analyze campaign performance",
      enabled: true,
      tools: ["Analytics", "Reporting", "KPI Tracking"],
      customInstructions: ""
    }
  ]);

  const [selectedCapability, setSelectedCapability] = useState<number | null>(null);

  const [workflowStages, setWorkflowStages] = useState([
    {
      name: "Strategy Planning",
      enabled: true,
      priority: "high",
      automationLevel: "full",
      reviewRequired: true
    },
    {
      name: "Content Creation",
      enabled: true,
      priority: "medium",
      automationLevel: "assisted",
      reviewRequired: true
    },
    {
      name: "Campaign Execution",
      enabled: true,
      priority: "high",
      automationLevel: "semi",
      reviewRequired: true
    },
    {
      name: "Performance Analysis",
      enabled: true,
      priority: "medium",
      automationLevel: "full",
      reviewRequired: false
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0F0225] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-purple-300/70 mb-6">
          <Link to="/" className="hover:text-purple-300">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/ai-agents" className="hover:text-purple-300">AI Agents</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-100">Customize Campaign Strategist</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-100">Campaign Strategist Customization</h1>
            <p className="text-purple-300/70 mt-2">
              Customize your Campaign Strategist's behavior and workflow integration
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#2D1B69] to-[#6D28D9] hover:from-[#3D2B79] hover:to-[#7D38E9] text-white"
            onClick={() => navigate('/ai-agents')}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="behavior" className="space-y-6">
          <TabsList className="bg-[#1A0B2E] border-b border-[#6D28D9]/20 p-1">
            <TabsTrigger 
              value="behavior" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D1B69] data-[state=active]:to-[#6D28D9] data-[state=active]:text-white data-[state=active]:border-none px-4 py-2"
            >
              <BrainCircuit className="w-4 h-4 mr-2" />
              Behavior
            </TabsTrigger>
            <TabsTrigger 
              value="workflow" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D1B69] data-[state=active]:to-[#6D28D9] data-[state=active]:text-white data-[state=active]:border-none px-4 py-2"
            >
              <Workflow className="w-4 h-4 mr-2" />
              Workflow Integration
            </TabsTrigger>
            <TabsTrigger 
              value="capabilities" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D1B69] data-[state=active]:to-[#6D28D9] data-[state=active]:text-white data-[state=active]:border-none px-4 py-2"
            >
              <Zap className="w-4 h-4 mr-2" />
              Capabilities
            </TabsTrigger>
          </TabsList>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <Card className="bg-[#1A0B2E] border-[#6D28D9]/20">
              <CardHeader className="border-b border-[#6D28D9]/20">
                <CardTitle className="text-purple-100">Response Behavior</CardTitle>
                <CardDescription className="text-purple-300/70">Configure how the Campaign Strategist generates responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 hover:border-[#6D28D9]/40 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-purple-100">Creativity Level</Label>
                          <p className="text-sm text-purple-300/70">Control how creative the agent's responses will be</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setCreativityLevel('low')}
                          className={`flex-1 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 ${
                            settings.temperature === 0.3 
                              ? 'bg-gradient-to-r from-[#2D1B69] to-[#6D28D9] text-white' 
                              : 'bg-[#2D1B69]/30 text-purple-300/70 hover:text-purple-100'
                          }`}
                        >
                          Low
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCreativityLevel('medium')}
                          className={`flex-1 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 ${
                            settings.temperature === 0.5 
                              ? 'bg-gradient-to-r from-[#2D1B69] to-[#6D28D9] text-white' 
                              : 'bg-[#2D1B69]/30 text-purple-300/70 hover:text-purple-100'
                          }`}
                        >
                          Medium
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCreativityLevel('high')}
                          className={`flex-1 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 ${
                            settings.temperature === 0.7 
                              ? 'bg-gradient-to-r from-[#2D1B69] to-[#6D28D9] text-white' 
                              : 'bg-[#2D1B69]/30 text-purple-300/70 hover:text-purple-100'
                          }`}
                        >
                          High
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 hover:border-[#6D28D9]/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-purple-100">Auto-Optimize Campaigns</Label>
                        <p className="text-sm text-purple-300/70">Automatically adjust strategies based on performance</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-purple-300/70">
                          {settings.autoOptimize ? 'On' : 'Off'}
                        </span>
                        <Switch 
                          checked={settings.autoOptimize}
                          onCheckedChange={(checked) => setSettings({...settings, autoOptimize: checked})}
                          className="custom-switch"
                          thumbClassName="custom-switch-thumb"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Integration Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card className="bg-[#1A0B2E] border-[#6D28D9]/20">
              <CardHeader className="border-b border-[#6D28D9]/20">
                <CardTitle className="text-purple-100">Workflow Integration Settings</CardTitle>
                <CardDescription className="text-purple-300/70">Configure how the Campaign Strategist integrates with your workflow</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Global Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-purple-100">Global Settings</h3>
                      <p className="text-sm text-purple-300/70">Configure workflow-wide behavior</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-purple-100">Parallel Execution</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-purple-300/70">
                            {settings.parallelExecution ? 'On' : 'Off'}
                          </span>
                          <Switch 
                            checked={settings.parallelExecution}
                            onCheckedChange={(checked) => setSettings({...settings, parallelExecution: checked})}
                            className="custom-switch"
                            thumbClassName="custom-switch-thumb"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-purple-100">Completion Notifications</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-purple-300/70">
                            {settings.notifyOnCompletion ? 'On' : 'Off'}
                          </span>
                          <Switch 
                            checked={settings.notifyOnCompletion}
                            onCheckedChange={(checked) => setSettings({...settings, notifyOnCompletion: checked})}
                            className="custom-switch"
                            thumbClassName="custom-switch-thumb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workflow Stages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-purple-100">Workflow Stages</h3>
                      <Button
                        variant="outline"
                        className="bg-[#2D1B69]/30 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 text-purple-100"
                        onClick={() => console.log('Add new stage')}
                      >
                        Add Stage
                      </Button>
                    </div>
                    
                    <div className="grid gap-4">
                      {workflowStages.map((stage, index) => (
                        <div 
                          key={index}
                          className="bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 hover:border-[#6D28D9]/40 transition-all overflow-hidden"
                        >
                          <div className="p-4 flex items-center justify-between border-b border-[#6D28D9]/20">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#2D1B69] to-[#6D28D9] rounded-full">
                                <span className="text-white text-sm">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="text-purple-100 font-medium">{stage.name}</h4>
                                <p className="text-sm text-purple-300/70">
                                  {stage.automationLevel === 'full' ? 'Fully Automated' : 
                                   stage.automationLevel === 'semi' ? 'Semi-Automated' : 
                                   'Human Assisted'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-[#2D1B69]/30 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 text-purple-100"
                                onClick={() => console.log('Configure stage')}
                              >
                                Configure
                              </Button>
                              <Switch 
                                checked={stage.enabled}
                                onCheckedChange={(checked) => {
                                  const newStages = [...workflowStages];
                                  newStages[index].enabled = checked;
                                  setWorkflowStages(newStages);
                                }}
                                className="custom-switch"
                                thumbClassName="custom-switch-thumb"
                              />
                            </div>
                          </div>
                          
                          {stage.enabled && (
                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label className="text-purple-100">Priority</Label>
                                <select 
                                  value={stage.priority}
                                  onChange={(e) => {
                                    const newStages = [...workflowStages];
                                    newStages[index].priority = e.target.value;
                                    setWorkflowStages(newStages);
                                  }}
                                  className="w-full bg-[#2D1B69]/30 border border-[#6D28D9]/20 rounded-md p-2 text-purple-100"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-purple-100">Automation Level</Label>
                                <select 
                                  value={stage.automationLevel}
                                  onChange={(e) => {
                                    const newStages = [...workflowStages];
                                    newStages[index].automationLevel = e.target.value;
                                    setWorkflowStages(newStages);
                                  }}
                                  className="w-full bg-[#2D1B69]/30 border border-[#6D28D9]/20 rounded-md p-2 text-purple-100"
                                >
                                  <option value="full">Fully Automated</option>
                                  <option value="semi">Semi-Automated</option>
                                  <option value="assisted">Human Assisted</option>
                                </select>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label className="text-purple-100">Review Required</Label>
                                <Switch 
                                  checked={stage.reviewRequired}
                                  onCheckedChange={(checked) => {
                                    const newStages = [...workflowStages];
                                    newStages[index].reviewRequired = checked;
                                    setWorkflowStages(newStages);
                                  }}
                                  className="custom-switch"
                                  thumbClassName="custom-switch-thumb"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="space-y-6">
            <Card className="bg-[#1A0B2E] border-[#6D28D9]/20 shadow-lg">
              <CardHeader className="border-b border-[#6D28D9]/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-purple-100 text-xl font-semibold">Agent Capabilities</CardTitle>
                    <CardDescription className="text-purple-300/70 mt-1">Customize the agent's capabilities and expertise levels</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-[#2D1B69]/30 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 hover:bg-[#2D1B69]/50 text-purple-100 transition-all duration-200 shadow-sm"
                    onClick={() => console.log('Add capability')}
                  >
                    Add Capability
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {capabilities.map((capability) => (
                    <div
                      key={capability.id}
                      className="bg-[#2D1B69]/30 rounded-xl border border-[#6D28D9]/20 hover:border-[#6D28D9]/40 transition-all duration-200 shadow-md hover:shadow-lg overflow-hidden transform hover:-translate-y-0.5"
                    >
                      <div className="p-5 flex items-center justify-between border-b border-[#6D28D9]/20">
                        <div className="flex items-center gap-5">
                          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-[#2D1B69] to-[#6D28D9] rounded-lg shadow-inner">
                            <span className="text-white text-lg font-medium">{capability.id}</span>
                          </div>
                          <div>
                            <h4 className="text-purple-100 font-semibold text-lg mb-1">{capability.name}</h4>
                            <p className="text-sm text-purple-300/70 leading-relaxed">{capability.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-[#2D1B69]/30 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 hover:bg-[#2D1B69]/50 text-purple-100 transition-all duration-200 shadow-sm px-4"
                            onClick={() => setSelectedCapability(selectedCapability === capability.id ? null : capability.id)}
                          >
                            {selectedCapability === capability.id ? 'Close' : 'Configure'}
                          </Button>
                          <Switch 
                            checked={capability.enabled}
                            onCheckedChange={(checked) => {
                              setCapabilities(capabilities.map(cap => 
                                cap.id === capability.id ? {...cap, enabled: checked} : cap
                              ));
                            }}
                            className="custom-switch"
                            thumbClassName="custom-switch-thumb"
                          />
                        </div>
                      </div>

                      {selectedCapability === capability.id && capability.enabled && (
                        <div className="p-5 space-y-6 bg-[#1A0B2E]/30">
                          <div className="space-y-3">
                            <Label className="text-purple-100 font-medium">Associated Tools</Label>
                            <div className="flex flex-wrap gap-2">
                              {capability.tools.map((tool, index) => (
                                <Badge
                                  key={index}
                                  className="bg-[#2D1B69]/50 hover:bg-[#2D1B69]/70 text-purple-100 border-[#6D28D9]/20 px-3 py-1 transition-colors duration-200"
                                >
                                  {tool}
                                </Badge>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-[#2D1B69]/30 border-[#6D28D9]/20 hover:border-[#6D28D9]/40 text-purple-100 h-7"
                                onClick={() => console.log('Add tool')}
                              >
                                + Add Tool
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <Label className="text-purple-100 font-medium">Custom Instructions</Label>
                            <textarea
                              value={capability.customInstructions}
                              onChange={(e) => {
                                setCapabilities(capabilities.map(cap => 
                                  cap.id === capability.id ? {...cap, customInstructions: e.target.value} : cap
                                ));
                              }}
                              placeholder="Add specific instructions or preferences for this capability..."
                              className="w-full h-32 bg-[#2D1B69]/30 border border-[#6D28D9]/20 hover:border-[#6D28D9]/40 rounded-lg p-3 text-purple-100 placeholder:text-purple-300/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/40"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentCustomization;
