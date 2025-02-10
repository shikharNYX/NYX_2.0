import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSignIcon,
  Users2Icon,
  LayoutTemplateIcon,
  TrendingUp, 
  ChevronRight 
} from "lucide-react";
import { useState } from "react";
import { RecommendationProgress } from "@/components/RecommendationProgress";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

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
  },
];

export default function AIInsights() {
  interface Step {
    id: number;
    title: string;
    description: string;
  }

  const [applyingToCampaign, setApplyingToCampaign] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const steps: Step[] = [
    {
      id: 1,
      title: "Analyzing Campaign Data",
      description: "Evaluating performance metrics and historical data"
    },
    {
      id: 2,
      title: "Optimizing Budget Allocation",
      description: "Adjusting budget distribution for maximum ROI"
    },
    {
      id: 3,
      title: "Updating Targeting Parameters",
      description: "Refining audience segments and demographics"
    },
    {
      id: 4,
      title: "Implementing Changes",
      description: "Applying optimized settings to your campaign"
    }
  ];

  const handleApplyRecommendations = (campaignName: string) => {
    setApplyingToCampaign(campaignName);
    
    // Simulate AI agent progress
    let step = 1;
    const interval = setInterval(() => {
      if (step < 5) {
        setCurrentStep(step);
        step += 1;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setApplyingToCampaign(null);
          setCurrentStep(1);
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
                <RecommendationProgress
                  steps={steps}
                  currentStep={currentStep}
                  onComplete={() => {
                    setApplyingToCampaign(null);
                    setCurrentStep(1);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
