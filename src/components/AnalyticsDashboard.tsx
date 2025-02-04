/**
 * @author Healium Digital
 * Analytics Dashboard Component
 * Displays campaign performance metrics and visualizations
 */

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FunnelChart from "@/components/FunnelChart";
import { MapComponent } from "@/components/MapComponent";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUpIcon,
  MousePointerClickIcon,
  EyeIcon,
  TargetIcon,
  DollarSignIcon,
  ActivityIcon,
  CalendarIcon,
  Loader,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { DownloadIcon } from "lucide-react";
import { MoreVerticalIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
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
import { useAnalytics } from "@/hooks/useAnalytics";

interface DataPoint {
  name: string;
  clicks: number;
  impressions: number;
  conversions: number;
  spend: number;
  cpc: number;
  ctr: number;
  cpm: number;
}

// Mock data for development
const mockData = {
  accountMetrics: [
    { label: "Spend", value: 0, change: 0 },
    { label: "Clicks", value: 0, change: 0 },
    { label: "Impressions", value: 0, change: 0 },
    { label: "CTR", value: 0, change: 0 },
    { label: "CPC", value: 0, change: 0 },
    { label: "Conversions", value: 0, change: 0 },
  ],
  timeSeriesData: [
    { date: "2024-01-01", impressions: 15000, clicks: 750, conversions: 80 },
    { date: "2024-01-02", impressions: 17500, clicks: 800, conversions: 90 },
    { date: "2024-01-03", impressions: 16800, clicks: 820, conversions: 85 },
    { date: "2024-01-04", impressions: 18200, clicks: 900, conversions: 95 },
    { date: "2024-01-05", impressions: 17900, clicks: 850, conversions: 88 },
    { date: "2024-01-06", impressions: 19500, clicks: 950, conversions: 100 },
    { date: "2024-01-07", impressions: 20100, clicks: 1000, conversions: 110 },
  ],
  campaignPerformance: [
    {
      name: "Campaign A",
      spend: 5000,
      impressions: 50000,
      clicks: 2500,
      conversions: 125,
    },
    {
      name: "Campaign B",
      spend: 3500,
      impressions: 35000,
      clicks: 1750,
      conversions: 88,
    },
    {
      name: "Campaign C",
      spend: 2800,
      impressions: 28000,
      clicks: 1400,
      conversions: 70,
    },
    {
      name: "Campaign D",
      spend: 4200,
      impressions: 42000,
      clicks: 2100,
      conversions: 105,
    },
    {
      name: "Campaign E",
      spend: 3900,
      impressions: 39000,
      clicks: 1950,
      conversions: 98,
    },
  ],
  geographicData: [
    { id: "USA", value: 35 },
    { id: "GBR", value: 20 },
    { id: "CAN", value: 15 },
    { id: "AUS", value: 10 },
    { id: "DEU", value: 8 },
    { id: "FRA", value: 7 },
    { id: "IND", value: 5 },
  ],
  funnelData: [
    { id: "Impressions", value: 15420, label: "Impressions" },
    { id: "Clicks", value: 8750, label: "Clicks" },
    { id: "Conversions", value: 3200, label: "Conversions" },
  ],
};

interface AnalyticsDashboardProps {
  platform?: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

const accountMetrics = mockData.accountMetrics;
const funnelMetrics = mockData.funnelData;

[
  {
    id: "Impressions",
    value: 15420,
    label: "Impressions",
  },
  {
    id: "Clicks",
    value: 8750,
    label: "Clicks",
  },
  {
    id: "Conversions",
    value: 3200,
    label: "Conversions",
  },
];

const metricOptionsForChart = [
  { key: "impressions", label: "Impressions", color: "#4F46E5" },
  { key: "clicks", label: "Clicks", color: "#7C3AED" },
  { key: "conversions", label: "Conversions", color: "#EC4899" },
  { key: "ctr", label: "CTR", color: "#FCD34D" },
  { key: "spend", label: "Spend", color: "#BE185D" },
  { key: "cpc", label: "CPC", color: "#047857" },
  { key: "cpm", label: "CPM", color: "#B45309" },
];

const metricOptions = [
  { value: "clicks", label: "Clicks" },
  { value: "impressions", label: "Impressions" },
  { value: "spend", label: "Total Spend" },
  { value: "cpc", label: "Cost per Click (CPC)" },
  { value: "ctr", label: "Click-Through Rate (CTR)" },
];

const segmentOptions = [
  { value: "demographics", label: "Demographics" },
  { value: "devices", label: "Devices" },
  { value: "campaign_objectives", label: "Campaign Objectives" },
  { value: "campaigns", label: "Campaigns" },
  { value: "gender", label: "Gender" },
];

const mockSegmentData = {
  demographics: [
    { name: "Age 18-24", value: 1500, distribution: 30, change: 5.2 },
    { name: "Age 25-34", value: 2000, distribution: 40, change: 8.1 },
    { name: "Age 35-44", value: 1000, distribution: 20, change: -2.3 },
    { name: "Age 45+", value: 500, distribution: 10, change: -1.5 },
  ],
  devices: [
    { name: "Mobile", value: 2500, distribution: 50, change: 12.5 },
    { name: "Desktop", value: 1500, distribution: 30, change: 4.2 },
    { name: "Tablet", value: 500, distribution: 10, change: -2 },
    { name: "Other", value: 500, distribution: 10, change: -3 },
  ],
  campaign_objectives: [
    { name: "Brand Awareness", value: 3000, distribution: 35, change: 7.8 },
    { name: "Website Traffic", value: 2500, distribution: 30, change: 5.2 },
    { name: "Lead Generation", value: 2000, distribution: 25, change: -1.5 },
    { name: "Sales", value: 800, distribution: 10, change: 3.4 },
  ],
  campaigns: [
    { name: "Summer Sale 2024", value: 2800, distribution: 28, change: 9.5 },
    { name: "New Product Launch", value: 2500, distribution: 25, change: 12.3 },
    { name: "Holiday Special", value: 2200, distribution: 22, change: -2.1 },
    { name: "Brand Campaign", value: 1500, distribution: 15, change: 4.7 },
    { name: "Retargeting", value: 1000, distribution: 10, change: 6.2 },
  ],
  gender: [
    { name: "Male", value: 4500, distribution: 45, change: 6.7 },
    { name: "Female", value: 4200, distribution: 42, change: 8.2 },
    { name: "Other", value: 800, distribution: 8, change: 3.1 },
    { name: "Undisclosed", value: 500, distribution: 5, change: -1.4 },
  ],
};

const formatValue = (value: number, metric: string): string => {
  switch (metric) {
    case "spend":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    case "cpc":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(value);
    case "cpm":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(value);
    case "ctr":
      return `${value?.toFixed(1)}%`;
    case "impressions":
    case "clicks":
    case "conversions":
      return new Intl.NumberFormat("en-US").format(value);
    default:
      return value?.toString();
  }
};

const formatLargeNumber = (value: string = "0"): string => {
  // Remove any existing formatting (commas, currency symbols)
  const cleanValue = value.replace(/[$,]/g, "");
  const num = parseFloat(cleanValue);

  if (isNaN(num)) return value; // Return original value if not a number

  // Check if it's a currency value
  const isCurrency = value.startsWith("$");

  if (num >= 1000000) {
    return `${isCurrency ? "$" : ""}${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${isCurrency ? "$" : ""}${(num / 1000).toFixed(1)}K`;
  }

  return value;
};

const gradientDefs = (
  <defs>
    <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#818CF8" />
      <stop offset="100%" stopColor="#4F46E5" />
    </linearGradient>
    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#34D399" />
      <stop offset="100%" stopColor="#059669" />
    </linearGradient>
    <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F472B6" />
      <stop offset="100%" stopColor="#DB2777" />
    </linearGradient>
    <linearGradient id="ctrGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#FCD34D" />
      <stop offset="100%" stopColor="#F59E0B" />
    </linearGradient>
    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#EC4899" />
      <stop offset="100%" stopColor="#BE185D" />
    </linearGradient>
    <linearGradient id="cpcGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#047857" />
    </linearGradient>
    <linearGradient id="cpmGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F59E0B" />
      <stop offset="100%" stopColor="#B45309" />
    </linearGradient>
  </defs>
);

const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    // Billions
    return (num / 1_000_000_000).toFixed(1) + "B";
  } else if (num >= 1_000_000) {
    // Millions
    return (num / 1_000_000).toFixed(1) + "M";
  } else if (num >= 1_000) {
    // Thousands
    return (num / 1_000).toFixed(1) + "K";
  } else {
    // Less than 1000, no formatting needed
    return num.toString();
  }
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  dateRange,
  platform,
}) => {
  const [timeRange, setTimeRange] = useState("daily");

  const {
    isLoading,
    isError,
    error,
    chartData,
    metricData,
    segmentData,
    regionData,
  } = useAnalytics({ ...{ dateRange, platform } }, timeRange);

  const funnelData = useMemo(() => {
    if (!metricData.data) return;
    return funnelMetrics.map((f) => ({
      ...f,
      value: metricData.data?.metrics.find((m) => m.label === f.label)?.value,
      maxValue: metricData.data?.metrics.find((m) => m.label === "Impressions")
        ?.value,
    }));
  }, [metricData.data]);

  const segmentOptions = useMemo(
    () =>
      Object.keys(segmentData.data?.segments || {}).map((key) => ({
        value: key,
        label: key.toUpperCase(),
      })),
    [segmentData.data]
  );

  const [activeTab, setActiveTab] = useState("customer");
  const [selectedSegment, setSelectedSegment] = useState("platform");
  const [selectedMetric, setSelectedMetric] = useState("clicks");
  const [selectedMetrics, setSelectedMetrics] = useState([
    "impressions",
    "clicks",
    "ctr",
    "spend",
  ]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) => {
      // Always keep at least one metric selected
      if (prev.includes(metric) && prev.length > 1) {
        return prev.filter((m) => m !== metric);
      } else if (!prev.includes(metric)) {
        return [...prev, metric];
      }
      return prev;
    });
  };

  // Format the date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get the date range string
  const getDateRangeString = (): string => {
    return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
  };

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-[#0F0720] via-[#1A0B2E] to-[#0F0720]">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Performance Behavior Section */}
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
              Performance Behavior
            </h2>
            <p className="text-purple-300/80 text-sm mt-1">
              Performance metrics and trends
            </p>
          </div>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            {(metricData.data?.metrics || accountMetrics).map((metric) => (
              <Card
                key={metric.label}
                className="bg-[#2A1A4D]/90 border-[#6D28D9]/30 text-left w-full"
              >
                <div className="p-3">
                  <p className="text-sm font-medium text-purple-300/80 mb-1">
                    {metric.label}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-purple-200 text-base font-semibold">
                      {formatLargeNumber(metric.value?.toFixed(2))}
                    </p>
                    <p
                      className={`text-sm ${
                        metric.change > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {/* Chart Section */}
          <div className="bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 p-6">
            <div className="flex justify-end mb-6">
              {/* <div className="flex gap-2">
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    timeRange === "daily"
                      ? "bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] text-white"
                      : "bg-[#2D1B69]/30 text-purple-300 hover:bg-[#2D1B69]/50"
                  } transition-all duration-200`}
                  onClick={() => setTimeRange("daily")}
                >
                  Daily
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    timeRange === "weekly"
                      ? "bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] text-white"
                      : "bg-[#2D1B69]/30 text-purple-300 hover:bg-[#2D1B69]/50"
                  } transition-all duration-200`}
                  onClick={() => setTimeRange("weekly")}
                >
                  Weekly
                </button>{" "}
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    timeRange === "monthly"
                      ? "bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] text-white"
                      : "bg-[#2D1B69]/30 text-purple-300 hover:bg-[#2D1B69]/50"
                  } transition-all duration-200`}
                  onClick={() => setTimeRange("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    timeRange === "yearly"
                      ? "bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] text-white"
                      : "bg-[#2D1B69]/30 text-purple-300 hover:bg-[#2D1B69]/50"
                  } transition-all duration-200`}
                  onClick={() => setTimeRange("yearly")}
                >
                  Yearly
                </button>
              </div> */}
            </div>

            <div className="h-[300px] w-full">
              {isLoading ? (
                <Loader className="m-auto h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData.data?.chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    {gradientDefs}
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#6D28D9"
                      vertical={false}
                      opacity={0.1}
                    />
                    <XAxis
                      dataKey="period"
                      axisLine={{ stroke: "#6D28D9" }}
                      tickLine={{ stroke: "#6D28D9" }}
                      tick={{ fill: "#E9D5FF", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={{ stroke: "#6D28D9" }}
                      tickLine={{ stroke: "#6D28D9" }}
                      tick={{ fill: "#E9D5FF", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(45, 27, 105, 0.9)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(109, 40, 217, 0.2)",
                        borderRadius: "12px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      labelStyle={{ color: "#E9D5FF" }}
                      itemStyle={{ color: "#E9D5FF" }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={72}
                      onClick={(e) => {
                        if (typeof e.dataKey === "string") {
                          toggleMetric(e.dataKey);
                        }
                      }}
                      content={({ payload }) => (
                        <div className="flex flex-wrap gap-3 justify-center mt-8">
                          {payload.map((entry) => (
                            <div
                              key={String(entry.dataKey)}
                              onClick={() => {
                                if (typeof entry.dataKey === "string") {
                                  toggleMetric(entry.dataKey);
                                }
                              }}
                              className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                                typeof entry.dataKey === "string" &&
                                selectedMetrics.includes(entry.dataKey)
                                  ? "bg-[#2D1B69]/50 text-white"
                                  : "text-purple-300/60 hover:text-purple-300"
                              }`}
                            >
                              {(typeof entry.dataKey !== "string" ||
                                !selectedMetrics.includes(entry.dataKey)) && (
                                <div className="absolute inset-0 flex items-center pointer-events-none">
                                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent transform -rotate-6" />
                                </div>
                              )}
                              <span
                                className={`w-3 h-3 rounded-full transition-opacity duration-200 ${
                                  typeof entry.dataKey === "string" &&
                                  !selectedMetrics.includes(entry.dataKey)
                                    ? "opacity-40"
                                    : ""
                                }`}
                                style={{
                                  background: entry.color
                                    .replace(
                                      "url(#",
                                      "linear-gradient(to right, "
                                    )
                                    .replace(")", ", #4F46E5)"),
                                }}
                              />
                              <span
                                className={`transition-opacity duration-200 ${
                                  typeof entry.dataKey === "string" &&
                                  !selectedMetrics.includes(entry.dataKey)
                                    ? "opacity-40"
                                    : ""
                                }`}
                              >
                                {metricOptionsForChart.find(
                                  (m) => m.key === entry.dataKey
                                )?.label || entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    {metricOptionsForChart.map((metric) => (
                      <Line
                        key={metric.key}
                        type="monotone"
                        dataKey={metric.key}
                        stroke={metric.color}
                        strokeWidth={2}
                        dot={{ fill: metric.color, r: 4, strokeWidth: 2 }}
                        activeDot={{
                          r: 6,
                          fill: "#E9D5FF",
                          stroke: metric.color,
                          strokeWidth: 2,
                        }}
                        hide={!selectedMetrics.includes(metric.key)}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Funnel and Segment Performance Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Funnel View */}
          <Card className="bg-[#1A0B2E] border-[#6D28D9]/20">
            <CardHeader>
              <CardTitle className="text-purple-100">
                Conversion Funnel
              </CardTitle>
              <CardDescription className="text-purple-300">
                Track your funnel conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent className="relative" style={{ height: "400px" }}>
              <div className="absolute inset-0">
                {funnelData && <FunnelChart data={funnelData} />}
              </div>
            </CardContent>
          </Card>

          {/* Segment Performance */}
          <Card className="p-6 bg-[#1A0B2E]/80 border-[#6D28D9]/20 backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                Segment Performance
              </h2>
              <p className="text-purple-300/80 text-sm mt-1">
                Detailed performance breakdown
              </p>
            </div>

            <div className="rounded-lg overflow-hidden border border-[#6D28D9]/20">
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 8px;
                      height: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: rgba(109, 40, 217, 0.1);
                      border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(109, 40, 217, 0.5);
                      border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: rgba(109, 40, 217, 0.7);
                    }
                  `,
                  }}
                />
                <Table>
                  <TableHeader className="sticky top-0 bg-[#1A0B2E] z-10">
                    <TableRow className="border-[#6D28D9]/20">
                      <TableHead className="w-[280px]">
                        <Select
                          value={selectedSegment}
                          onValueChange={setSelectedSegment}
                        >
                          <SelectTrigger className="w-full bg-transparent text-purple-300 border-0 hover:bg-[#2D1B69]/50 transition-all duration-200 -ml-2">
                            <SelectValue placeholder="Select Segment" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-300">
                            {segmentOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="hover:bg-[#6D28D9]/20 focus:bg-[#6D28D9]/20 text-purple-300"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead className="w-[220px]">
                        <Select
                          value={selectedMetric}
                          onValueChange={setSelectedMetric}
                        >
                          <SelectTrigger className="w-full bg-transparent text-purple-300 border-0 hover:bg-[#2D1B69]/50 transition-all duration-200 -ml-2">
                            <SelectValue placeholder="Select Metric" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-300">
                            {metricOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="hover:bg-[#6D28D9]/20 focus:bg-[#6D28D9]/20 text-purple-300"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableHead>
                      <TableHead className="w-[150px] text-purple-300 font-medium">
                        Change
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segmentData.data?.segments?.[selectedSegment]?.map(
                      (item) => (
                        <TableRow
                          key={item.label}
                          className="border-[#6D28D9]/20 hover:bg-[#2D1B69]/40"
                        >
                          <TableCell className="font-medium text-purple-300">
                            {item.label}
                          </TableCell>
                          <TableCell className="text-purple-300">
                            {selectedMetric
                              ? formatValue(
                                  item[selectedMetric],
                                  selectedMetric
                                )
                              : "Select a metric"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  item.change >= 0
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-rose-500/10 text-rose-400"
                                }`}
                              >
                                {item.change >= 0 ? "↑" : "↓"}{" "}
                                {Math.abs(item.change || 0)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>

        {/* Regional Performance Section */}
        <Card className="p-6 bg-[#1A0B2E]/80 border-[#6D28D9]/20 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
              Regional Performance
            </h2>
            <p className="text-purple-300/80 text-sm mt-1">
              Performance metrics by region
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="min-h-[400px] bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 p-4">
              <MapComponent />
            </div>
            <div className="min-h-[400px] bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-purple-300">
                  Region Details
                </h3>
                <Select
                  value={selectedMetric}
                  onValueChange={setSelectedMetric}
                >
                  <SelectTrigger className="w-[180px] bg-[#2D1B69]/30 text-purple-300 border-[#6D28D9]/20 hover:bg-[#2D1B69]/50 transition-all duration-200">
                    <SelectValue placeholder="Select Metric" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-300">
                    {metricOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-[#6D28D9]/20 focus:bg-[#6D28D9]/20 text-purple-300"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="overflow-auto max-h-[340px] custom-scrollbar"> 

              <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 8px;
                      height: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: rgba(109, 40, 217, 0.1);
                      border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(109, 40, 217, 0.5);
                      border-radius: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: rgba(109, 40, 217, 0.7);
                    }
                  `,
                  }}
                />

                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-[#2D1B69]/40 border-[#6D28D9]/20">
                      <TableHead className="text-purple-300 font-medium">
                        Region
                      </TableHead>
                      <TableHead className="text-purple-300 font-medium">
                        Value
                      </TableHead>
                      <TableHead className="text-purple-300 font-medium">
                        Distribution
                      </TableHead>
                      <TableHead className="text-purple-300 font-medium">
                        Change
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regionData.data?.region?.["user_location_country"]?.map(
                      (item) => (
                        <TableRow
                          key={item.label}
                          className="hover:bg-[#2D1B69]/40 border-[#6D28D9]/20"
                        >
                          <TableCell className="font-medium text-purple-300">
                            {item.label}
                          </TableCell>
                          <TableCell className="text-purple-300">
                            {selectedMetric
                              ? formatValue(
                                  item.data?.[selectedMetric].value,
                                  selectedMetric
                                )
                              : "Select a metric"}
                          </TableCell>
                          <TableCell className="text-purple-300">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-[#2D1B69]/30 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#6D28D9] to-[#9F5BF0]"
                                  style={{
                                    width: `${item.data?.[selectedMetric].perc}%`,
                                  }}
                                />
                              </div>
                              <span>{item.data?.[selectedMetric].perc}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-purple-300">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                item.data?.[selectedMetric].change >= 0
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-rose-500/10 text-rose-400"
                              }`}
                            >
                              {item.data?.[selectedMetric].change >= 0
                                ? "↑"
                                : "↓"}{" "}
                              {Math.abs(
                                item.data?.[selectedMetric].change || 0
                              )}
                              %
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
