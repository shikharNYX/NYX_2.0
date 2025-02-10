import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info, Edit } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar, Legend
} from 'recharts';
import RecommendationsPanel, { Recommendation } from './RecommendationsPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditCampaignDialog from './EditCampaignDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

interface CampaignMetrics {
  adCost: number;
  costPerConversion: number;
  clicks: number;
  impressions: number;
  ctr: number;
  conversions: number;
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
}

interface PerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  costPerConversion: number;
}

interface CampaignProps {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'completed';
  platform: 'google' | 'meta' | 'linkedin';
  metrics: CampaignMetrics;
  performanceData: PerformanceData[];
  isExpanded: boolean;
  recommendations: Recommendation[];
  onToggleExpand: () => void;
  onApplyRecommendation: (recommendation: Recommendation) => void;
  onEditCampaign: (id: number, updates: Partial<CampaignProps>) => void;
}

const CampaignItem = ({ 
  id,
  name,
  status,
  platform,
  metrics,
  performanceData,
  isExpanded,
  onToggleExpand,
  onApplyRecommendation,
  onEditCampaign,
  recommendations
}: CampaignProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: CampaignProps['status']) => {
    if (theme === 'dark') {
      switch (status) {
        case 'active':
          return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'paused':
          return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'completed':
          return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      }
    } else {
      switch (status) {
        case 'active':
          return 'bg-purple-100 text-purple-700 border-purple-300';
        case 'paused':
          return 'bg-yellow-100 text-yellow-700 border-yellow-300';
        case 'completed':
          return 'bg-gray-100 text-gray-700 border-gray-300';
      }
    }
  };

  const formatMetricValue = (value: number | undefined | null, type: 'currency' | 'number' | 'percentage' = 'number'): string => {
    const safeValue = value || 0;
    
    if (type === 'currency') {
      return `$${safeValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    } else if (type === 'percentage') {
      return `${safeValue.toFixed(1)}%`;
    } else {
      if (safeValue >= 1000) {
        return `${(safeValue / 1000).toFixed(1)}K`;
      }
      return safeValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    }
  };

  const calculatePercentageChange = (current: number | undefined | null, previous: number | undefined | null): string => {
    const safeCurrentValue = current || 0;
    const safePreviousValue = previous || 0;
    
    if (safePreviousValue === 0) {
      return safeCurrentValue > 0 ? '+100%' : '0%';
    }
    const change = ((safeCurrentValue - safePreviousValue) / safePreviousValue) * 100;
    if (isNaN(change)) return '0%';
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const safeMetrics = {
    adCost: metrics?.adCost || 0,
    costPerClick: metrics?.costPerClick || 0,
    clicks: metrics?.clicks || 0,
    impressions: metrics?.impressions || 0,
    previousPeriod: {
      adCost: metrics?.previousPeriod?.adCost || 0,
      clicks: metrics?.previousPeriod?.clicks || 0,
      impressions: metrics?.previousPeriod?.impressions || 0
    }
  };

  const metricCards = [
    {
      title: 'Ad Cost',
      value: formatMetricValue(safeMetrics.adCost, 'currency'),
      change: calculatePercentageChange(safeMetrics.adCost, safeMetrics.previousPeriod.adCost)
    },
    {
      title: 'CPC',
      value: formatMetricValue(safeMetrics.costPerClick, 'currency'),
      change: calculatePercentageChange(safeMetrics.costPerClick, safeMetrics.previousPeriod.adCost / safeMetrics.previousPeriod.clicks)
    },
    {
      title: 'Impressions',
      value: formatMetricValue(safeMetrics.impressions),
      change: calculatePercentageChange(safeMetrics.impressions, safeMetrics.previousPeriod.impressions)
    },
    {
      title: 'Clicks',
      value: formatMetricValue(safeMetrics.clicks),
      change: calculatePercentageChange(safeMetrics.clicks, safeMetrics.previousPeriod.clicks)
    },
    {
      title: 'CTR',
      value: formatMetricValue((safeMetrics.clicks / safeMetrics.impressions) * 100 || 0, 'percentage'),
      change: calculatePercentageChange(
        (safeMetrics.clicks / safeMetrics.impressions) * 100,
        (safeMetrics.previousPeriod.clicks / safeMetrics.previousPeriod.impressions) * 100
      )
    }
  ];

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['impressions', 'clicks']);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        // Don't allow deselecting if it's the last metric
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== metric);
      }
      return [...prev, metric];
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditDialog(true);
  };

  return (
    <>
      <Card className={cn(
        "mb-2 border transition-colors",
        theme === 'dark' 
          ? "border-purple-500/20 bg-indigo-950/30 hover:border-purple-500/30"
          : "border-gray-200 bg-white hover:border-purple-300 shadow-sm"
      )}>
        <div
          className={cn(
            "p-4 cursor-pointer",
            isExpanded && (theme === 'dark' ? "border-b border-purple-500/20" : "border-b border-gray-200")
          )}
          onClick={onToggleExpand}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className={cn(
                  "text-2xl font-semibold mb-1",
                  theme === 'dark' ? "text-white" : "text-gray-900"
                )}>{name}</div>
                <div className={cn(
                  "text-sm",
                  theme === 'dark' ? "text-purple-300" : "text-gray-600"
                )}>Campaign ID: #{id}</div>
              </div>
              <Badge className={`${getStatusColor(status)} text-sm px-3 py-1 font-medium`}>
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === 'dark'
                    ? "bg-purple-500/10 hover:bg-purple-500/20"
                    : "bg-purple-50 hover:bg-purple-100"
                )}
              >
                <Edit className={cn(
                  "h-5 w-5",
                  theme === 'dark' ? "text-purple-300" : "text-purple-600"
                )} />
              </button>
              {isExpanded ? (
                <ChevronUp className={cn(
                  "h-6 w-6",
                  theme === 'dark' ? "text-purple-300" : "text-purple-600"
                )} />
              ) : (
                <ChevronDown className={cn(
                  "h-6 w-6",
                  theme === 'dark' ? "text-purple-300" : "text-purple-600"
                )} />
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {metricCards.map((metric, index) => (
                <Card key={index} className={cn(
                  "border transition-colors",
                  theme === 'dark'
                    ? "bg-[#2D1B69]/30 border-purple-500/20"
                    : "bg-white border-gray-200 shadow-sm"
                )}>
                  <CardContent className="p-4">
                    <div className={cn(
                      "text-sm font-medium mb-2",
                      theme === 'dark' ? "text-purple-300" : "text-gray-600"
                    )}>
                      {metric.title}
                    </div>
                    <div className={cn(
                      "text-2xl font-semibold mb-1",
                      theme === 'dark' ? "text-white" : "text-gray-900"
                    )}>
                      {metric.value}
                    </div>
                    <div className={cn(
                      "text-sm",
                      metric.change.startsWith('+')
                        ? theme === 'dark' ? "text-green-400" : "text-green-600"
                        : metric.change.startsWith('-')
                        ? theme === 'dark' ? "text-red-400" : "text-red-600"
                        : theme === 'dark' ? "text-gray-400" : "text-gray-600"
                    )}>
                      {metric.change} vs last period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className={cn(
                "border transition-colors",
                theme === 'dark'
                  ? "bg-[#2D1B69]/30 border-purple-500/20"
                  : "bg-white border-gray-200 shadow-sm"
              )}>
                <CardHeader>
                  <CardTitle className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                  )}>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme === 'dark' ? "#6D28D9" : "#7C3AED"} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={theme === 'dark' ? "#6D28D9" : "#7C3AED"} stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme === 'dark' ? "#9333EA" : "#9333EA"} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={theme === 'dark' ? "#9333EA" : "#9333EA"} stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          stroke={theme === 'dark' ? "#6B7280" : "#9CA3AF"}
                          tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#4B5563" }}
                        />
                        <YAxis 
                          stroke={theme === 'dark' ? "#6B7280" : "#9CA3AF"}
                          tick={{ fill: theme === 'dark' ? "#9CA3AF" : "#4B5563" }}
                        />
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme === 'dark' ? "#374151" : "#E5E7EB"}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? "#1F2937" : "#FFFFFF",
                            borderColor: theme === 'dark' ? "#374151" : "#E5E7EB",
                            color: theme === 'dark' ? "#F3F4F6" : "#111827"
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="impressions"
                          stroke={theme === 'dark' ? "#6D28D9" : "#7C3AED"}
                          fillOpacity={1}
                          fill="url(#colorImpressions)"
                        />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke={theme === 'dark' ? "#9333EA" : "#9333EA"}
                          fillOpacity={1}
                          fill="url(#colorClicks)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations Panel */}
              <Card className={cn(
                "border transition-colors",
                theme === 'dark'
                  ? "bg-[#2D1B69]/30 border-purple-500/20"
                  : "bg-white border-gray-200 shadow-sm"
              )}>
                <CardHeader>
                  <CardTitle className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                  )}>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecommendationsPanel
                    recommendations={recommendations}
                    onApplyRecommendation={onApplyRecommendation}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Card>

      <EditCampaignDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        campaignId={id.toString()}
        campaignName={name}
        campaignStatus={status}
        metrics={metrics}
      />
    </>
  );
};

export default CampaignItem;
