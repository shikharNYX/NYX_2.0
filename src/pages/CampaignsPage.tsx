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

interface CampaignState {
  id: number;
  name: string;
  status: "active" | "paused" | "completed";
  platform: "google" | "meta" | "linkedin";
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    target: {
      conversions: number;
    };
  };
  isExpanded?: boolean;
  performanceData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    costPerConversion: number;
  }>;
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
        campaign.id === action.campaign.id ? action.campaign : campaign
      );
    default:
      return state;
  }
};

const initialCampaigns = [
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
      },
      {
        date: "2024-01-02",
        impressions: 16000,
        clicks: 3200,
        costPerConversion: 43,
      },
      {
        date: "2024-01-03",
        impressions: 17500,
        clicks: 3500,
        costPerConversion: 41,
      },
      {
        date: "2024-01-04",
        impressions: 18000,
        clicks: 3600,
        costPerConversion: 40,
      },
      {
        date: "2024-01-05",
        impressions: 19000,
        clicks: 3800,
        costPerConversion: 38,
      },
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
      },
      {
        date: "2024-01-02",
        impressions: 22000,
        clicks: 4400,
        costPerConversion: 53,
      },
      {
        date: "2024-01-03",
        impressions: 24000,
        clicks: 4800,
        costPerConversion: 52,
      },
      {
        date: "2024-01-04",
        impressions: 26000,
        clicks: 5200,
        costPerConversion: 51,
      },
      {
        date: "2024-01-05",
        impressions: 28000,
        clicks: 5600,
        costPerConversion: 50,
      },
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
      },
      {
        date: "2024-01-02",
        impressions: 9000,
        clicks: 1800,
        costPerConversion: 83,
      },
      {
        date: "2024-01-03",
        impressions: 10000,
        clicks: 2000,
        costPerConversion: 82,
      },
      {
        date: "2024-01-04",
        impressions: 11000,
        clicks: 2200,
        costPerConversion: 81,
      },
      {
        date: "2024-01-05",
        impressions: 12000,
        clicks: 2400,
        costPerConversion: 80,
      },
    ],
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
            impressions: campaign.metrics.impressions * 1.15,
            clicks: campaign.metrics.clicks * 1.15,
            conversions: campaign.metrics.conversions * 1.15,
          },
        };
        break;
      case "content":
        changes = {
          metrics: {
            ...campaign.metrics,
            clicks: campaign.metrics.clicks * 1.1,
            conversions: campaign.metrics.conversions * 1.1,
          },
        };
        break;
      case "demographics":
        changes = {
          metrics: {
            ...campaign.metrics,
            impressions: campaign.metrics.impressions * 1.25,
            clicks: campaign.metrics.clicks * 1.2,
          },
        };
        break;
    }

    dispatch({
      type: "UPDATE_CAMPAIGN",
      campaign: { ...campaign, ...changes },
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
