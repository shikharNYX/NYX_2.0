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

// Mock data for recommendations
const recommendationTypes = [
  {
    type: "Budget",
    count: 5,
    icon: DollarSignIcon,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    type: "Demographics",
    count: 4,
    icon: Users2Icon,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    type: "Content",
    count: 3,
    icon: LayoutTemplateIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
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

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Headline Section */}
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
              AI-Powered Insights
            </h2>
            <p className="text-purple-300/80 text-sm mt-1">Smart recommendations and campaign optimization insights</p>
          </div>

          {/* Recommendation Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationTypes.map((rec) => {
              const Icon = rec.icon;
              return (
                <Card key={rec.type} className="bg-[#1A0B2E]/80 border-[#6D28D9]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${rec.bgColor}`}>
                          <Icon className={`h-6 w-6 ${rec.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-purple-200">{rec.type}</h3>
                          <p className="text-sm text-purple-300/80">
                            {rec.count} campaign{rec.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-purple-300/60" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Campaign Specific Recommendations */}
          <div className="space-y-4">
            {campaignRecommendations.map((campaign) => (
              <Card key={campaign.campaignName} className="bg-[#1A0B2E]/80 border-[#6D28D9]/20">
                <CardContent className="p-6">
                  {/* Campaign Name */}
                  <h3 className="text-xl font-medium text-purple-200 mb-4">
                    {campaign.campaignName}
                  </h3>

                  {/* Recommendations */}
                  <div className="space-y-4 mb-6">
                    {campaign.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                        <p className="text-purple-300/90">{rec}</p>
                      </div>
                    ))}
                  </div>

                  {/* Expected Metrics Improvement */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(campaign.metrics).map(([metric, improvement]) => (
                      <div key={metric} className="bg-[#2D1B69]/50 p-3 rounded-lg">
                        <p className="text-sm text-purple-300/80 uppercase">{metric}</p>
                        <p className={`text-lg font-medium ${
                          metric === 'cpc' || metric === 'cpm' 
                            ? 'text-green-400' // negative values (cost reduction) in green
                            : improvement.startsWith('+') 
                              ? 'text-green-400' // positive values in green
                              : 'text-red-400' // negative values in red
                        }`}>
                          {improvement}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <div className="flex justify-end">
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleApplyRecommendations(campaign.campaignName)}
                      disabled={applyingToCampaign !== null}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Apply Recommendations
                    </Button>
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
