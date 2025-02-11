import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSignIcon,
  Users2Icon,
  LayoutTemplateIcon,
  TrendingUp, 
  ChevronRight,
  RotateCw
} from "lucide-react";
import { useState } from "react";
import { RecommendationProgress } from "@/components/RecommendationProgress";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data for recommendations
const recommendationTypes = [
  {
    type: "Budget",
    count: 5,
    icon: DollarSignIcon,
    color: "text-emerald-400",
    lightColor: "text-emerald-600",
    bgColor: "bg-emerald-400/10",
    lightBgColor: "bg-emerald-100",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    type: "Demographics",
    count: 4,
    icon: Users2Icon,
    color: "text-blue-400",
    lightColor: "text-blue-600",
    bgColor: "bg-blue-400/10",
    lightBgColor: "bg-blue-100",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    type: "Content",
    count: 3,
    icon: LayoutTemplateIcon,
    color: "text-purple-400",
    lightColor: "text-purple-600",
    bgColor: "bg-purple-400/10",
    lightBgColor: "bg-purple-100",
    gradient: "from-purple-400 to-purple-600",
  },
];

const campaignRecommendations = [
  {
    campaignName: "Summer Sale 2024",
    recommendations: [
      "Increase daily budget by 20%",
      "Expand targeting to include ages 25-34",
      "Add more video content formats",
    ],
    metrics: {
      ctr: "+15%",
      cpc: "-18%",
      cpm: "-12%",
      roas: "+25%"
    },
    projections: [
      { month: 'Mar', ctr: 2.1, cpc: 1.8, cpm: 5.2, roas: 2.8 },
      { month: 'Apr', ctr: 2.3, cpc: 1.6, cpm: 4.9, roas: 3.1 },
      { month: 'May', ctr: 2.5, cpc: 1.4, cpm: 4.6, roas: 3.4 },
      { month: 'Jun', ctr: 2.7, cpc: 1.2, cpm: 4.3, roas: 3.7 },
    ]
  },
  {
    campaignName: "Brand Awareness Q1",
    recommendations: [
      "Optimize ad scheduling for peak hours",
      "Focus on high-performing demographics",
      "Implement automated bidding strategy",
    ],
    metrics: {
      ctr: "+22%",
      cpc: "-15%",
      cpm: "-8%",
      roas: "+30%"
    },
    projections: [
      { month: 'Mar', ctr: 1.8, cpc: 2.1, cpm: 6.1, roas: 2.2 },
      { month: 'Apr', ctr: 2.1, cpc: 1.9, cpm: 5.8, roas: 2.5 },
      { month: 'May', ctr: 2.4, cpc: 1.7, cpm: 5.5, roas: 2.8 },
      { month: 'Jun', ctr: 2.7, cpc: 1.5, cpm: 5.2, roas: 3.1 },
    ]
  },
];

const MetricChart = ({ data, isDark }: { data: any[], isDark: boolean }) => {
  const colors = {
    ctr: isDark ? '#10B981' : '#059669',
    cpc: isDark ? '#F59E0B' : '#D97706',
    cpm: isDark ? '#6366F1' : '#4F46E5',
    roas: isDark ? '#EC4899' : '#DB2777'
  };

  return (
    <div className="mt-6 p-4 rounded-lg border bg-card h-[300px] w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className={cn(
          "text-sm font-medium",
          isDark ? "text-purple-200" : "text-gray-900"
        )}>Projected Metrics</h4>
        <div className="flex items-center gap-4">
          {Object.entries(colors).map(([metric, color]) => (
            <div key={metric} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className={cn(
                "text-xs font-medium",
                isDark ? "text-purple-200" : "text-gray-900"
              )}>
                {metric.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1F2937' : '#E5E7EB'} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
              stroke={isDark ? '#374151' : '#D1D5DB'}
            />
            <YAxis 
              tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
              stroke={isDark ? '#374151' : '#D1D5DB'}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
              }}
              labelStyle={{ color: isDark ? '#D1D5DB' : '#374151' }}
            />
            {Object.entries(colors).map(([metric, color]) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={metric.toUpperCase()}
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function AIInsights() {
  interface Step {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'error';
  }

  const [applyingToCampaign, setApplyingToCampaign] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Analyzing Campaign Data",
      description: "Evaluating performance metrics and historical data",
      status: 'pending'
    },
    {
      id: 2,
      title: "Optimizing Budget Allocation",
      description: "Adjusting budget distribution for maximum ROI",
      status: 'pending'
    },
    {
      id: 3,
      title: "Updating Targeting Parameters",
      description: "Refining audience segments and demographics",
      status: 'pending'
    },
    {
      id: 4,
      title: "Implementing Changes",
      description: "Applying optimized settings to your campaign",
      status: 'pending'
    }
  ]);

  const handleApplyRecommendations = (campaignName: string) => {
    setApplyingToCampaign(campaignName);
    
    // Reset steps status
    setSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    setCurrentStep(1);
    
    // Simulate AI agent progress
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setSteps(prevSteps => prevSteps.map((step, idx) => ({
          ...step,
          status: idx === stepIndex ? 'running' : idx < stepIndex ? 'completed' : 'pending'
        })));
        stepIndex += 1;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setSteps(prevSteps => prevSteps.map(step => ({ ...step, status: 'completed' })));
          setTimeout(() => {
            setApplyingToCampaign(null);
            setCurrentStep(1);
          }, 1000);
        }, 1000);
      }
    }, 2000);
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "p-4 min-h-screen",
      isDark 
        ? "bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]"
        : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
    )}>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Headline Section */}
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className={cn(
              "text-2xl font-semibold",
              isDark
                ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
                : "text-gray-900"
            )}>
              AI-Powered Insights
            </h2>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-purple-300/80" : "text-gray-600"
            )}>Smart recommendations and campaign optimization insights</p>
          </div>

          {/* Recommendation Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationTypes.map((rec) => {
              const Icon = rec.icon;
              return (
                <Card key={rec.type} className={cn(
                  "border transition-colors",
                  isDark
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isDark ? rec.bgColor : rec.lightBgColor
                        )}>
                          <Icon className={cn(
                            "h-6 w-6",
                            isDark ? rec.color : rec.lightColor
                          )} />
                        </div>
                        <div>
                          <h3 className={cn(
                            "text-lg font-medium",
                            isDark ? "text-purple-200" : "text-gray-900"
                          )}>{rec.type}</h3>
                          <p className={cn(
                            "text-sm",
                            isDark ? "text-purple-300/80" : "text-gray-600"
                          )}>
                            {rec.count} campaign{rec.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5",
                        isDark ? "text-purple-300/60" : "text-gray-400"
                      )} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Campaign Specific Recommendations */}
          <div className="space-y-4">
            {campaignRecommendations.map((campaign) => (
              <Card key={campaign.campaignName} className={cn(
                "border transition-colors",
                isDark
                  ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                  : "bg-white border-gray-200"
              )}>
                <CardContent className="p-6">
                  {/* Campaign Name */}
                  <h3 className={cn(
                    "text-xl font-medium mb-4",
                    isDark ? "text-purple-200" : "text-gray-900"
                  )}>
                    {campaign.campaignName}
                  </h3>

                  {/* Recommendations */}
                  <div className="space-y-4 mb-6">
                    {campaign.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={cn(
                          "mt-1 h-2 w-2 rounded-full",
                          isDark ? "bg-purple-400" : "bg-purple-500"
                        )} />
                        <p className={cn(
                          isDark ? "text-purple-300/90" : "text-gray-600"
                        )}>{rec}</p>
                      </div>
                    ))}
                  </div>

                  {/* Expected Metrics Improvement */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(campaign.metrics).map(([metric, improvement]) => (
                      <div key={metric} className={cn(
                        "p-3 rounded-lg",
                        isDark ? "bg-[#2D1B69]/50" : "bg-gray-50"
                      )}>
                        <p className={cn(
                          "text-sm uppercase",
                          isDark ? "text-purple-300/80" : "text-gray-500"
                        )}>{metric}</p>
                        <p className={cn(
                          "text-lg font-medium",
                          metric === 'cpc' || metric === 'cpm' 
                            ? (isDark ? 'text-green-400' : 'text-green-600')
                            : improvement.startsWith('+') 
                              ? (isDark ? 'text-green-400' : 'text-green-600')
                              : (isDark ? 'text-red-400' : 'text-red-600')
                        )}>
                          {improvement}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Metrics Projection Chart */}
                  <div className="space-y-6">
                    <MetricChart data={campaign.projections} isDark={isDark} />

                    {/* Apply Button */}
                    <div className="flex justify-end">
                      {applyingToCampaign === campaign.campaignName ? (
                        <RecommendationProgress
                          steps={steps}
                          currentStep={currentStep}
                          onComplete={() => setApplyingToCampaign(null)}
                        />
                      ) : (
                        <Button
                          onClick={() => handleApplyRecommendations(campaign.campaignName)}
                          className={cn(
                            "px-4 py-2",
                            isDark
                              ? "bg-purple-500 hover:bg-purple-600 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          )}
                        >
                          Apply Recommendations
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Overlay */}
                  {applyingToCampaign && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                      <div className="w-full max-w-2xl">
                        <h2 className="text-2xl font-semibold text-purple-200 mb-4">
                          Applying Recommendations to {applyingToCampaign}
                        </h2>

                        {/* Processing step - show all steps with status */}
                        <div className="space-y-2 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between">
                            <div className="text-purple-200">
                              Current Progress
                            </div>
                            <div className="text-purple-300/70">
                              {steps.filter(step => step.status === 'completed').length} of {steps.length} steps completed
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-[#2D1B69]/30 border border-purple-500/20">
                            {/* Step Items with connecting lines */}
                            <div className="space-y-1.5 relative">
                              {/* Connecting lines */}
                              {steps.map((step, index) => (
                                index < steps.length - 1 && (
                                  <div 
                                    key={`line-${index}`}
                                    className="absolute"
                                    style={{ 
                                      left: '2.025rem',
                                      top: `${(index * 48) + 24}px`,
                                      width: '2px',
                                      height: '48px',
                                      backgroundColor: step.status === 'completed' 
                                        ? '#8B5CF6' 
                                        : 'rgba(109, 40, 217, 0.2)',
                                      transition: 'background-color 0.3s ease'
                                    }}
                                  />
                                )
                              ))}
                              
                              {/* Steps */}
                              {steps.map((step, index) => (
                                <div 
                                  key={step.id}
                                  className={cn(
                                    "flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200",
                                    step.status === 'running' 
                                      ? 'bg-[#2D1B69]/70 shadow-lg shadow-purple-500/10' 
                                      : step.status === 'completed' 
                                      ? 'bg-green-900/20' 
                                      : 'bg-[#2D1B69]/20'
                                  )}
                                >
                                  <div className="flex items-center min-w-0 gap-3">
                                    <div className="relative flex items-center justify-center w-[3rem] flex-shrink-0">
                                      <div className={cn(
                                        "w-5 h-5 rounded-full transition-all duration-300 border-2 flex items-center justify-center",
                                        step.status === 'running'
                                          ? 'border-purple-400 bg-[#1A0B2E] shadow-lg shadow-purple-500/20'
                                          : step.status === 'completed'
                                          ? 'border-green-400 bg-green-400'
                                          : 'border-purple-500/20 bg-[#1A0B2E]'
                                      )}>
                                        {step.status === 'running' && (
                                          <RotateCw className="w-2.5 h-2.5 text-purple-400 animate-spin" />
                                        )}
                                        {step.status === 'completed' && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#1A0B2E]" />
                                        )}
                                      </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className={cn(
                                        step.status === 'running'
                                          ? 'text-purple-200 font-medium'
                                          : step.status === 'completed'
                                          ? 'text-green-400'
                                          : 'text-purple-300/70'
                                      )}>
                                        {step.title}
                                      </p>
                                      <p className="text-sm text-purple-300/50">
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Overlay */}
          {applyingToCampaign && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
              <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-purple-200 mb-4">
                  Applying Recommendations to {applyingToCampaign}
                </h2>

                {/* Processing step - show all steps with status */}
                <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="text-purple-200">
                      Current Progress
                    </div>
                    <div className="text-purple-300/70">
                      {steps.filter(step => step.status === 'completed').length} of {steps.length} steps completed
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#2D1B69]/30 border border-purple-500/20">
                    {/* Step Items with connecting lines */}
                    <div className="space-y-1.5 relative">
                      {/* Connecting lines */}
                      {steps.map((step, index) => (
                        index < steps.length - 1 && (
                          <div 
                            key={`line-${index}`}
                            className="absolute"
                            style={{ 
                              left: '2.025rem',
                              top: `${(index * 48) + 24}px`,
                              width: '2px',
                              height: '48px',
                              backgroundColor: step.status === 'completed' 
                                ? '#8B5CF6' 
                                : 'rgba(109, 40, 217, 0.2)',
                              transition: 'background-color 0.3s ease'
                            }}
                          />
                        )
                      ))}
                      
                      {/* Steps */}
                      {steps.map((step, index) => (
                        <div 
                          key={step.id}
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200",
                            step.status === 'running' 
                              ? 'bg-[#2D1B69]/70 shadow-lg shadow-purple-500/10' 
                              : step.status === 'completed' 
                              ? 'bg-green-900/20' 
                              : 'bg-[#2D1B69]/20'
                          )}
                        >
                          <div className="flex items-center min-w-0 gap-3">
                            <div className="relative flex items-center justify-center w-[3rem] flex-shrink-0">
                              <div className={cn(
                                "w-5 h-5 rounded-full transition-all duration-300 border-2 flex items-center justify-center",
                                step.status === 'running'
                                  ? 'border-purple-400 bg-[#1A0B2E] shadow-lg shadow-purple-500/20'
                                  : step.status === 'completed'
                                  ? 'border-green-400 bg-green-400'
                                  : 'border-purple-500/20 bg-[#1A0B2E]'
                              )}>
                                {step.status === 'running' && (
                                  <RotateCw className="w-2.5 h-2.5 text-purple-400 animate-spin" />
                                )}
                                {step.status === 'completed' && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A0B2E]" />
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={cn(
                                step.status === 'running'
                                  ? 'text-purple-200 font-medium'
                                  : step.status === 'completed'
                                  ? 'text-green-400'
                                  : 'text-purple-300/70'
                              )}>
                                {step.title}
                              </p>
                              <p className="text-sm text-purple-300/50">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
