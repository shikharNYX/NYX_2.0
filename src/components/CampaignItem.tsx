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
  const getStatusColor = (status: CampaignProps['status']) => {
    switch (status) {
      case 'active':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      <Card className="mb-2 border border-purple-500/20 bg-indigo-950/30 hover:border-purple-500/30 transition-colors">
        <div
          className={`p-4 cursor-pointer ${isExpanded ? 'border-b border-purple-500/20' : ''}`}
          onClick={onToggleExpand}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-semibold text-white mb-1">{name}</div>
                <div className="text-sm text-purple-300">Campaign ID: #{id}</div>
              </div>
              <Badge className={`${getStatusColor(status)} text-sm px-3 py-1 font-medium`}>
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
              >
                <Edit className="h-5 w-5 text-purple-300" />
              </button>
              {isExpanded ? (
                <ChevronUp className="h-6 w-6 text-purple-300" />
              ) : (
                <ChevronDown className="h-6 w-6 text-purple-300" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 pt-3">
            <div className="mt-4 space-y-6">
              {/* Campaign Details Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-100">Campaign Details</h3>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="7d">
                      <SelectTrigger className="h-8 w-[130px] bg-[#1A0B2E] border-purple-500/20">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 w-[130px] bg-[#1A0B2E] border-purple-500/20">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="meta">Meta Ads</SelectItem>
                        <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-1.5 mb-2">
                  {metricCards.map((metric, index) => (
                    <Card key={index} className="border-purple-500/20 bg-[#1A0B2E] shadow-sm">
                      <CardContent className="px-3 py-2">
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-purple-300/80">{metric.title}</span>
                            <TooltipProvider>
                              <UITooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-purple-400/70" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Previous period: {
                                    metric.title === 'CTR' 
                                      ? formatMetricValue(
                                          (safeMetrics.previousPeriod.clicks / safeMetrics.previousPeriod.impressions) * 100,
                                          'percentage'
                                        )
                                      : metric.title === 'CPC'
                                      ? formatMetricValue(
                                          safeMetrics.previousPeriod.clicks > 0 
                                            ? safeMetrics.previousPeriod.adCost / safeMetrics.previousPeriod.clicks 
                                            : 0,
                                          'currency'
                                        )
                                      : formatMetricValue(
                                          safeMetrics.previousPeriod[metric.title === 'Ad Cost' ? 'adCost' : metric.title.toLowerCase()],
                                          metric.title === 'Ad Cost' ? 'currency' : 'number'
                                        )
                                  }</p>
                                </TooltipContent>
                              </UITooltip>
                            </TooltipProvider>
                          </div>
                          <div className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.change}
                          </div>
                        </div>
                        <div className="text-base font-medium text-gray-100 mt-1.5">
                          {metric.value}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="border-purple-500/20 bg-[#1A0B2E]">
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm font-medium text-purple-100">Impressions vs. Clicks</CardTitle>
                        <CardDescription className="text-xs text-purple-300/80">Track your campaign reach and engagement</CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <div className="bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 p-2">
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={performanceData}>
                                <defs>
                                  <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818CF8" />
                                    <stop offset="100%" stopColor="#4F46E5" />
                                  </linearGradient>
                                  <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#34D399" />
                                    <stop offset="100%" stopColor="#059669" />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid 
                                  strokeDasharray="3 3" 
                                  stroke="#6D28D9" 
                                  vertical={false} 
                                  opacity={0.1} 
                                />
                                <XAxis 
                                  dataKey="date" 
                                  axisLine={{ stroke: '#6D28D9' }}
                                  tickLine={{ stroke: '#6D28D9' }}
                                  tick={{ fill: '#E9D5FF', fontSize: 12 }}
                                />
                                <YAxis 
                                  axisLine={{ stroke: '#6D28D9' }}
                                  tickLine={{ stroke: '#6D28D9' }}
                                  tick={{ fill: '#E9D5FF', fontSize: 12 }}
                                  domain={['auto', 'auto']}
                                  padding={{ top: 20, bottom: 20 }}
                                />
                                <Tooltip
                                  contentStyle={{ 
                                    backgroundColor: 'rgba(45, 27, 105, 0.9)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(109, 40, 217, 0.2)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                  }}
                                  labelStyle={{ color: '#E9D5FF' }}
                                  itemStyle={{ color: '#E9D5FF' }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="impressions"
                                  stroke="url(#impressionsGradient)"
                                  strokeWidth={2}
                                  dot={{ fill: '#818CF8', r: 4, strokeWidth: 2 }}
                                  activeDot={{ r: 6, fill: '#E9D5FF', stroke: '#818CF8', strokeWidth: 2 }}
                                  name="Impressions"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="clicks"
                                  stroke="url(#clicksGradient)"
                                  strokeWidth={2}
                                  dot={{ fill: '#34D399', r: 4, strokeWidth: 2 }}
                                  activeDot={{ r: 6, fill: '#E9D5FF', stroke: '#34D399', strokeWidth: 2 }}
                                  name="Clicks"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-500/20 bg-[#1A0B2E]">
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm font-medium text-purple-100">Cost per Conversion Trend</CardTitle>
                        <CardDescription className="text-xs text-purple-300/80">Monitor your conversion costs over time</CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <div className="bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 p-2">
                          <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={performanceData}>
                                <defs>
                                  <linearGradient id="cpcGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F472B6" />
                                    <stop offset="100%" stopColor="#BE185D" />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid 
                                  strokeDasharray="3 3" 
                                  stroke="#6D28D9" 
                                  vertical={false} 
                                  opacity={0.1} 
                                />
                                <XAxis 
                                  dataKey="date" 
                                  axisLine={{ stroke: '#6D28D9' }}
                                  tickLine={{ stroke: '#6D28D9' }}
                                  tick={{ fill: '#E9D5FF', fontSize: 12 }}
                                />
                                <YAxis 
                                  axisLine={{ stroke: '#6D28D9' }}
                                  tickLine={{ stroke: '#6D28D9' }}
                                  tick={{ fill: '#E9D5FF', fontSize: 12 }}
                                  tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                  contentStyle={{ 
                                    backgroundColor: 'rgba(45, 27, 105, 0.9)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(109, 40, 217, 0.2)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                  }}
                                  labelStyle={{ color: '#E9D5FF' }}
                                  itemStyle={{ color: '#E9D5FF' }}
                                  formatter={(value) => [`$${value}`, 'Cost per Conversion']}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="costPerConversion"
                                  stroke="url(#cpcGradient)"
                                  strokeWidth={2}
                                  dot={{ fill: '#F472B6', r: 4, strokeWidth: 2 }}
                                  activeDot={{ r: 6, fill: '#E9D5FF', stroke: '#F472B6', strokeWidth: 2 }}
                                  name="Cost per Conversion"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Recommendations Section */}
              <Card className="border-purple-500/20 bg-[#1A0B2E]">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm font-medium text-purple-100">Recommendations</CardTitle>
                  <CardDescription className="text-xs text-purple-300/80">Get personalized suggestions</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-1">
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
