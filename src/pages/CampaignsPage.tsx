import React, { useReducer, useState } from "react";
import CampaignItem from "../components/CampaignItem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, Plus } from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";
import { Recommendation } from "../components/RecommendationsPanel";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface CampaignState {
  id: number;
  name: string;
  status: "active" | "paused" | "completed";
  platform: "google" | "meta" | "linkedin";
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    adCost: number;
    costPerConversion: number;
    ctr: number;
    conversionRate: number;
    costPerClick: number;
    cpm: number;
    previousPeriod: {
      adCost: number;
      costPerConversion: number;
      clicks: number;
      impressions: number;
      conversions: number;
    };
    target: {
      conversions: number;
    };
  };
  performanceData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    costPerConversion: number;
    cost: number;
    ctr: number;
    cpc: number;
    cpm: number;
  }>;
  updateLogs: Array<{
    id: string;
    type: "budget" | "demographics" | "content";
    description: string;
    timestamp: string;
    changes: {
      from: string;
      to: string;
    };
  }>;
  isExpanded?: boolean;
}

type CampaignAction =
  | { type: "TOGGLE_EXPAND"; id: number }
  | { type: "UPDATE_CAMPAIGN"; campaign: CampaignState };

const campaignReducer = (
  state: CampaignState[],
  action: CampaignAction
): CampaignState[] => {
  switch (action.type) {
    case "TOGGLE_EXPAND":
      return state.map((campaign) => ({
        ...campaign,
        isExpanded: campaign.id === action.id ? !campaign.isExpanded : false,
      }));
    case "UPDATE_CAMPAIGN":
      return state.map((campaign) =>
        campaign.id === action.campaign.id ? { ...campaign, ...action.campaign } : campaign
      );
    default:
      return state;
  }
};

const initialCampaigns: CampaignState[] = [
  {
    id: 1,
    name: "Summer Sale 2024",
    status: "active" as const,
    platform: "google" as const,
    metrics: {
      impressions: 125000,
      clicks: 25000,
      conversions: 1250,
      spend: 5000,
      adCost: 5000,
      costPerConversion: 4,
      ctr: 2.4,
      conversionRate: 0.05,
      costPerClick: 0.2,
      cpm: 40,
      previousPeriod: {
        adCost: 4000,
        costPerConversion: 3.5,
        clicks: 20000,
        impressions: 100000,
        conversions: 1000,
      },
      target: {
        conversions: 2000,
      },
    },
    performanceData: [
      {
        date: "2024-01-01",
        impressions: 15000,
        clicks: 3000,
        costPerConversion: 45,
        cost: 5000,
        ctr: 2.4,
        cpc: 1.67,
        cpm: 33.33
      },
      {
        date: "2024-01-02",
        impressions: 16000,
        clicks: 3200,
        costPerConversion: 43,
        cost: 5200,
        ctr: 2.5,
        cpc: 1.63,
        cpm: 32.50
      },
      {
        date: "2024-01-03",
        impressions: 17500,
        clicks: 3500,
        costPerConversion: 41,
        cost: 5600,
        ctr: 2.6,
        cpc: 1.60,
        cpm: 32.00
      },
      {
        date: "2024-01-04",
        impressions: 18000,
        clicks: 3600,
        costPerConversion: 40,
        cost: 5800,
        ctr: 2.7,
        cpc: 1.61,
        cpm: 32.22
      },
      {
        date: "2024-01-05",
        impressions: 19000,
        clicks: 3800,
        costPerConversion: 38,
        cost: 6000,
        ctr: 2.8,
        cpc: 1.58,
        cpm: 31.58
      },
    ],
    updateLogs: [
      {
        id: "log1",
        type: "budget",
        description: "Daily budget increased",
        timestamp: "2 hours ago",
        changes: {
          from: "$100/day",
          to: "$120/day"
        }
      },
      {
        id: "log2",
        type: "demographics",
        description: "Target audience expanded",
        timestamp: "1 day ago",
        changes: {
          from: "18-24, Male",
          to: "18-24, 25-34, Male"
        }
      },
      {
        id: "log3",
        type: "content",
        description: "Ad creative updated",
        timestamp: "3 days ago",
        changes: {
          from: "Image Ad #1",
          to: "Video Ad #2"
        }
      }
    ],
    isExpanded: false,
  },
  {
    id: 2,
    name: "New Product Launch",
    status: "paused" as const,
    platform: "meta" as const,
    metrics: {
      impressions: 75000,
      clicks: 15000,
      conversions: 500,
      spend: 3000,
      adCost: 3000,
      costPerConversion: 6,
      ctr: 2.0,
      conversionRate: 0.033,
      costPerClick: 0.2,
      cpm: 40,
      previousPeriod: {
        adCost: 2500,
        costPerConversion: 5.5,
        clicks: 12500,
        impressions: 62500,
        conversions: 400,
      },
      target: {
        conversions: 2500,
      },
    },
    performanceData: [
      {
        date: "2024-01-01",
        impressions: 20000,
        clicks: 4000,
        costPerConversion: 55,
        cost: 3000,
        ctr: 2.0,
        cpc: 0.75,
        cpm: 15.00
      },
      {
        date: "2024-01-02",
        impressions: 22000,
        clicks: 4400,
        costPerConversion: 53,
        cost: 3200,
        ctr: 2.1,
        cpc: 0.73,
        cpm: 14.55
      },
      {
        date: "2024-01-03",
        impressions: 24000,
        clicks: 4800,
        costPerConversion: 52,
        cost: 3400,
        ctr: 2.2,
        cpc: 0.71,
        cpm: 14.17
      },
      {
        date: "2024-01-04",
        impressions: 26000,
        clicks: 5200,
        costPerConversion: 51,
        cost: 3600,
        ctr: 2.3,
        cpc: 0.69,
        cpm: 13.85
      },
      {
        date: "2024-01-05",
        impressions: 28000,
        clicks: 5600,
        costPerConversion: 50,
        cost: 3800,
        ctr: 2.4,
        cpc: 0.68,
        cpm: 13.57
      },
    ],
    updateLogs: [
      {
        id: "log4",
        type: "content",
        description: "Campaign paused for optimization",
        timestamp: "5 hours ago",
        changes: {
          from: "Active",
          to: "Paused"
        }
      },
      {
        id: "log5",
        type: "demographics",
        description: "Location targeting refined",
        timestamp: "2 days ago",
        changes: {
          from: "All regions",
          to: "High-performing regions only"
        }
      }
    ],
    isExpanded: false,
  },
  {
    id: 3,
    name: "B2B Lead Generation",
    status: "active" as const,
    platform: "linkedin" as const,
    metrics: {
      impressions: 50000,
      clicks: 10000,
      conversions: 100,
      spend: 8000,
      adCost: 8000,
      costPerConversion: 80,
      ctr: 2.0,
      conversionRate: 0.01,
      costPerClick: 0.8,
      cpm: 160,
      previousPeriod: {
        adCost: 7000,
        costPerConversion: 70,
        clicks: 9000,
        impressions: 45000,
        conversions: 90,
      },
      target: {
        conversions: 150,
      },
    },
    performanceData: [
      {
        date: "2024-01-01",
        impressions: 8000,
        clicks: 1600,
        costPerConversion: 85,
        cost: 8000,
        ctr: 2.0,
        cpc: 5.0,
        cpm: 100.00
      },
      {
        date: "2024-01-02",
        impressions: 9000,
        clicks: 1800,
        costPerConversion: 83,
        cost: 8200,
        ctr: 2.1,
        cpc: 4.89,
        cpm: 91.11
      },
      {
        date: "2024-01-03",
        impressions: 10000,
        clicks: 2000,
        costPerConversion: 82,
        cost: 8400,
        ctr: 2.2,
        cpc: 4.78,
        cpm: 84.00
      },
      {
        date: "2024-01-04",
        impressions: 11000,
        clicks: 2200,
        costPerConversion: 81,
        cost: 8600,
        ctr: 2.3,
        cpc: 4.67,
        cpm: 78.18
      },
      {
        date: "2024-01-05",
        impressions: 12000,
        clicks: 2400,
        costPerConversion: 80,
        cost: 8800,
        ctr: 2.4,
        cpc: 4.56,
        cpm: 73.33
      },
    ],
    updateLogs: [],
    isExpanded: false,
  },
];

const recommendationsMap = {
  1: [
    {
      id: "rec1",
      campaignId: 1,
      type: "budget" as const,
      description: "Increase budget by 20%",
      impact: {
        metric: "Conversions",
        value: "+15%",
        direction: "up" as const,
      },
      details:
        "Based on current performance trends, increasing the budget could lead to more conversions while maintaining CPA.",
    },
    {
      id: "rec2",
      campaignId: 1,
      type: "content" as const,
      description: "Test new ad formats",
      impact: {
        metric: "CTR",
        value: "+10%",
        direction: "up" as const,
      },
      details: "Adding video content could improve engagement rates.",
    },
    {
      id: "rec3",
      campaignId: 1,
      type: "demographics" as const,
      description: "Expand age targeting",
      impact: {
        metric: "Reach",
        value: "+25%",
        direction: "up" as const,
      },
      details: "Include 25-34 age group showing high engagement potential.",
    },
  ],
  2: [
    {
      id: "rec4",
      campaignId: 2,
      type: "demographics" as const,
      description: "Expand audience targeting",
      impact: {
        metric: "Reach",
        value: "+25%",
        direction: "up" as const,
      },
      details: "Include similar audiences to reach more potential customers.",
    },
  ],
  3: [],
};

const CampaignsPage: React.FC = () => {
  const [campaigns, dispatch] = useReducer(campaignReducer, initialCampaigns);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleApplyRecommendation = (recommendation: Recommendation) => {
    const campaign = campaigns.find((c) => c.id === recommendation.campaignId);
    if (!campaign) return;

    let changes: Partial<CampaignState> = {};

    switch (recommendation.type) {
      case "budget":
        changes = {
          metrics: {
            ...campaign.metrics,
            spend: campaign.metrics.spend * 1.2,
          },
          updateLogs: [
            ...campaign.updateLogs,
            {
              id: Date.now().toString(),
              type: "budget" as const,
              description: "Increased budget by 20%",
              timestamp: new Date().toISOString(),
              changes: {
                from: campaign.metrics.spend.toString(),
                to: (campaign.metrics.spend * 1.2).toString(),
              },
            },
          ],
        };
        break;
    }

    dispatch({
      type: "UPDATE_CAMPAIGN",
      campaign: {
        ...campaign,
        ...changes
      } as CampaignState
    });
  };

  const onEditCampaign = (
    campaignId: number,
    updates: Partial<CampaignState>
  ) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;

    const updatedCampaign = {
      ...campaign,
      ...updates,
    };

    dispatch({ type: "UPDATE_CAMPAIGN", campaign: updatedCampaign });
  };

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
              Campaign Management
            </h2>
            <p className={cn(
              "text-sm mt-1",
              isDark ? "text-purple-300/80" : "text-gray-600"
            )}>
              Manage and optimize your active campaigns
            </p>
          </div>

          <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col space-y-8">
              {/* Header with search */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className={cn(
                      "absolute left-2.5 top-2.5 h-4 w-4",
                      isDark ? "text-purple-500" : "text-purple-600"
                    )} />
                    <Input
                      placeholder="Search campaigns..."
                      className={cn(
                        "pl-9 border",
                        isDark
                          ? "bg-[#1A0B2E] border-purple-500/20"
                          : "bg-white border-purple-200 focus:border-purple-400"
                      )}
                    />
                  </div>
                </div>

                <Link
                  to={`/ai-workflows`}
                  className={cn(
                    "flex justify-center items-center cursor-pointer px-2 text-white border-0",
                    isDark
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  )}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Link>
              </div>

              {/* Campaign Cards */}
              <div className="grid grid-cols-1 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignItem
                    key={campaign.id}
                    {...campaign}
                    isExpanded={campaign.isExpanded}
                    onToggleExpand={() =>
                      dispatch({ type: "TOGGLE_EXPAND", id: campaign.id })
                    }
                    onApplyRecommendation={handleApplyRecommendation}
                    recommendations={recommendationsMap[campaign.id] || []}
                    onEditCampaign={onEditCampaign}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
