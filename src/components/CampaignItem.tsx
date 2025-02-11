import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info, Edit } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar, Legend
} from 'recharts';
import RecommendationsPanel, { Recommendation } from './RecommendationsPanel';
import UpdateLogs from './UpdateLogs';
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
import cn from 'classnames';
import { CampaignState } from '../pages/CampaignsPage';

interface CampaignProps extends Omit<CampaignState, 'isExpanded'> {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApplyRecommendation: (recommendation: Recommendation) => void;
  onEditCampaign: (id: number, updates: Partial<CampaignState>) => void;
  recommendations: Recommendation[];
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
  recommendations,
  updateLogs
}: CampaignProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: CampaignProps['status']) => {
    switch (status) {
      case 'active':
        return theme === 'dark' 
          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
          : 'bg-purple-100 text-purple-600 border-purple-200';
      case 'paused':
        return theme === 'dark'
          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          : 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'completed':
        return theme === 'dark'
          ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          : 'bg-gray-100 text-gray-600 border-gray-200';
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

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['cost', 'ctr', 'cpc', 'cpm']);
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
          : "border-gray-200 bg-white hover:border-purple-300"
      )}>
        <div
          className={cn(
            "p-4 cursor-pointer",
            isExpanded && (theme === 'dark' ? 'border-b border-purple-500/20' : 'border-b border-gray-200')
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
                  theme === 'dark' ? "text-purple-300" : "text-gray-500"
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
                    : "bg-gray-100 hover:bg-gray-200"
                )}
              >
                <Edit className={cn(
                  "h-5 w-5",
                  theme === 'dark' ? "text-purple-300" : "text-gray-600"
                )} />
              </button>
              {isExpanded ? (
                <ChevronUp className={cn(
                  "h-6 w-6",
                  theme === 'dark' ? "text-purple-300" : "text-gray-600"
                )} />
              ) : (
                <ChevronDown className={cn(
                  "h-6 w-6",
                  theme === 'dark' ? "text-purple-300" : "text-gray-600"
                )} />
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
                  <h3 className={cn(
                    "text-sm font-medium",
                    theme === 'dark' ? "text-gray-100" : "text-gray-600"
                  )}>Campaign Details</h3>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="7d">
                      <SelectTrigger className={cn(
                        "h-8 w-[130px] bg-[#1A0B2E]",
                        theme === 'dark' ? "border-purple-500/20" : "border-gray-200"
                      )}>
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className={cn(
                        "h-8 w-[130px] bg-[#1A0B2E]",
                        theme === 'dark' ? "border-purple-500/20" : "border-gray-200"
                      )}>
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
                    <Card key={index} className={cn(
                      "border-purple-500/20 bg-[#1A0B2E] shadow-sm",
                      theme === 'dark' ? "" : "bg-white"
                    )}>
                      <CardContent className="px-3 py-2">
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "text-xs",
                              theme === 'dark' ? "text-purple-300/80" : "text-gray-500"
                            )}>{metric.title}</span>
                            <TooltipProvider>
                              <UITooltip>
                                <TooltipTrigger>
                                  <Info className={cn(
                                    "h-3 w-3",
                                    theme === 'dark' ? "text-purple-400/70" : "text-gray-600"
                                  )} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className={cn(
                                    "text-xs",
                                    theme === 'dark' ? "text-gray-100" : "text-gray-600"
                                  )}>Previous period: {
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
                          <div className={cn(
                            "text-xs font-medium",
                            metric.change.startsWith('+') ? "text-green-600" : "text-red-600"
                          )}>
                            {metric.change}
                          </div>
                        </div>
                        <div className={cn(
                          "text-base font-medium",
                          theme === 'dark' ? "text-gray-100" : "text-gray-600"
                        )}>
                          {metric.value}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts and Recommendations Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-[1.6fr_1fr] gap-4">
                    <Card className={cn(
                      "border-purple-500/20 bg-[#1A0B2E]",
                      theme === 'dark' ? "" : "bg-white"
                    )}>
                      <CardHeader className="p-2 pb-0">
                        <CardTitle className={cn(
                          "text-sm font-medium",
                          theme === 'dark' ? "text-purple-100" : "text-gray-600"
                        )}>Campaign Performance Metrics</CardTitle>
                        <CardDescription className={cn(
                          "text-xs",
                          theme === 'dark' ? "text-purple-300/80" : "text-gray-500"
                        )}>Track your campaign performance over time</CardDescription>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className={cn(
                          "bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 p-3 w-full",
                          theme === 'dark' ? "" : "bg-white"
                        )}>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={performanceData} margin={{ top: 11, right: 10, left: 10, bottom: 36 }}>
                                <defs>
                                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#EC4899" />
                                    <stop offset="100%" stopColor="#BE185D" />
                                  </linearGradient>
                                  <linearGradient id="ctrGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FCD34D" />
                                    <stop offset="100%" stopColor="#F59E0B" />
                                  </linearGradient>
                                  <linearGradient id="cpcGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818CF8" />
                                    <stop offset="100%" stopColor="#4F46E5" />
                                  </linearGradient>
                                  <linearGradient id="cpmGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#34D399" />
                                    <stop offset="100%" stopColor="#059669" />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid 
                                  strokeDasharray="3 3" 
                                  stroke={theme === 'dark' ? "#6D28D9" : "#E5E7EB"} 
                                  vertical={false} 
                                  opacity={0.1} 
                                />
                                <XAxis 
                                  dataKey="date" 
                                  axisLine={{ stroke: theme === 'dark' ? '#6D28D9' : '#E5E7EB' }}
                                  tickLine={{ stroke: theme === 'dark' ? '#6D28D9' : '#E5E7EB' }}
                                  tick={{ fill: theme === 'dark' ? '#E9D5FF' : '#4B5563', fontSize: 12 }}
                                />
                                {/* Cost Y-axis */}
                                <YAxis 
                                  yAxisId="cost"
                                  axisLine={{ stroke: theme === 'dark' ? '#6D28D9' : '#E5E7EB' }}
                                  tickLine={{ stroke: theme === 'dark' ? '#6D28D9' : '#E5E7EB' }}
                                  tick={{ fill: theme === 'dark' ? '#E9D5FF' : '#4B5563', fontSize: 11 }}
                                  tickFormatter={(value) => `$${value}`}
                                  width={45}
                                />
                                {/* CTR Y-axis */}
                                <YAxis 
                                  yAxisId="percentage"
                                  orientation="right"
                                  axisLine={{ stroke: theme === 'dark' ? '#6D28D9' : '#E5E7EB' }}
                                  tickLine={{ stroke: theme === 'dark' ? '#6D28D9' : '#E5E7EB' }}
                                  tick={{ fill: theme === 'dark' ? '#E9D5FF' : '#4B5563', fontSize: 11 }}
                                  tickFormatter={(value) => `${value}%`}
                                  width={35}
                                />
                                <Tooltip
                                  contentStyle={{ 
                                    backgroundColor: theme === 'dark' ? 'rgba(45, 27, 105, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(8px)',
                                    border: theme === 'dark' ? '1px solid rgba(109, 40, 217, 0.2)' : '1px solid rgba(229, 231, 235, 1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                  }}
                                  labelStyle={{ color: theme === 'dark' ? '#E9D5FF' : '#4B5563' }}
                                  itemStyle={{ color: theme === 'dark' ? '#E9D5FF' : '#4B5563' }}
                                  formatter={(value, name) => {
                                    if (name === 'CTR') return `${value}%`;
                                    if (name === 'Cost' || name === 'CPC' || name === 'CPM') return `$${value}`;
                                    return value;
                                  }}
                                />
                                <Legend 
                                  verticalAlign="bottom"
                                  height={36}
                                  iconType="circle"
                                  iconSize={8}
                                  content={({ payload }) => {
                                    const colors = {
                                      cost: '#EC4899',
                                      ctr: '#FCD34D',
                                      cpc: '#818CF8',
                                      cpm: '#34D399'
                                    };
                                    const labels = {
                                      cost: 'Cost',
                                      ctr: 'CTR',
                                      cpc: 'CPC',
                                      cpm: 'CPM'
                                    };
                                    return (
                                      <div className="flex flex-wrap gap-3 justify-center mt-8">
                                        {payload?.map((entry: any) => (
                                          <div
                                            key={String(entry.dataKey)}
                                            onClick={() => toggleMetric(String(entry.dataKey))}
                                            className={cn(
                                              "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200",
                                              selectedMetrics.includes(String(entry.dataKey))
                                                ? theme === 'dark'
                                                  ? "bg-[#2D1B69]/50 text-white"
                                                  : "bg-gray-100 text-gray-800"
                                                : theme === 'dark'
                                                  ? "text-purple-300/60 hover:text-purple-300"
                                                  : "text-gray-400 hover:text-gray-600"
                                            )}
                                          >
                                            {!selectedMetrics.includes(String(entry.dataKey)) && (
                                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent transform -rotate-6" />
                                              </div>
                                            )}
                                            <div 
                                              className={`w-3 h-3 rounded-full ${
                                                !selectedMetrics.includes(String(entry.dataKey)) ? 'opacity-40' : ''
                                              }`}
                                              style={{ backgroundColor: colors[entry.dataKey as keyof typeof colors] }}
                                            />
                                            <span className="text-xs font-medium">{labels[entry.dataKey as keyof typeof labels]}</span>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  }}
                                />
                                {selectedMetrics.includes('cost') && (
                                  <Line
                                    yAxisId="cost"
                                    type="monotone"
                                    dataKey="cost"
                                    stroke="url(#costGradient)"
                                    strokeWidth={2}
                                    dot={{ fill: '#EC4899', r: 4 }}
                                    activeDot={{ r: 6, fill: '#E9D5FF', stroke: '#EC4899', strokeWidth: 2 }}
                                    name="Cost"
                                  />
                                )}
                                {selectedMetrics.includes('ctr') && (
                                  <Line
                                    yAxisId="percentage"
                                    type="monotone"
                                    dataKey="ctr"
                                    stroke="url(#ctrGradient)"
                                    strokeWidth={2}
                                    dot={{ fill: '#FCD34D', r: 4 }}
                                    activeDot={{ r: 6, fill: '#E9D5FF', stroke: '#FCD34D', strokeWidth: 2 }}
                                    name="CTR"
                                  />
                                )}
                                {selectedMetrics.includes('cpc') && (
                                  <Line
                                    yAxisId="cost"
                                    type="monotone"
                                    dataKey="cpc"
                                    stroke="url(#cpcGradient)"
                                    strokeWidth={2}
                                    dot={{ fill: '#818CF8', r: 4 }}
                                    activeDot={{ r: 6, fill: '#E9D5FF', stroke: '#818CF8', strokeWidth: 2 }}
                                    name="CPC"
                                  />
                                )}
                                {selectedMetrics.includes('cpm') && (
                                  <Line
                                    yAxisId="cost"
                                    type="monotone"
                                    dataKey="cpm"
                                    stroke="url(#cpmGradient)"
                                    strokeWidth={2}
                                    dot={{ fill: '#34D399', r: 4 }}
                                    activeDot={{ r: 6, fill: '#E9D5FF', stroke: '#34D399', strokeWidth: 2 }}
                                    name="CPM"
                                  />
                                )}
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={cn(
                      "border-purple-500/20 bg-[#1A0B2E] h-full",
                      theme === 'dark' ? "" : "bg-white"
                    )}>
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className={cn(
                          "text-sm font-medium",
                          theme === 'dark' ? "text-purple-100" : "text-gray-600"
                        )}>Recommendations</CardTitle>
                        <CardDescription className={cn(
                          "text-xs",
                          theme === 'dark' ? "text-purple-300/80" : "text-gray-500"
                        )}>Get personalized suggestions</CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-1">
                        <div className="flex flex-col gap-2">
                          <RecommendationsPanel 
                            recommendations={recommendations}
                            onApplyRecommendation={onApplyRecommendation}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Update Logs Section */}
                <UpdateLogs logs={updateLogs} />
              </div>
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
        onEditCampaign={onEditCampaign}
      />
    </>
  );
};

export default CampaignItem;
