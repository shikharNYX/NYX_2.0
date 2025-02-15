import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import FunnelChart from "@/components/FunnelChart";
import { useTheme } from "next-themes";
import cn from "classnames";

// Mock data - Replace with actual API data
const mockData = {
  customerMetrics: {
    totalCustomers: 25890,
    newCustomers: 8250,
    repeatCustomers: 17640,
  },
  customerTypes: {
    free: 15890,
    paid: 10000,
  },
  demographics: {
    age: [
      { group: "18-24", value: 20 },
      { group: "25-34", value: 35 },
      { group: "35-44", value: 25 },
      { group: "45-54", value: 15 },
      { group: "55+", value: 5 },
    ],
    gender: [
      { group: "Male", value: 55 },
      { group: "Female", value: 42 },
      { group: "Other", value: 3 },
    ],
  },
  customerDistribution: {
    segments: [
      { name: "Demographics", value: "demographics" },
      { name: "Spending Habits", value: "spending" },
      { name: "Customer Lifetime", value: "lifetime" },
      { name: "Top Products", value: "products" },
      { name: "Acquisition Channels", value: "channels" },
      { name: "Conversion Channels", value: "conversion" },
    ],
    data: {
      demographics: [
        { name: "18-24", value: 30 },
        { name: "25-34", value: 45 },
        { name: "35-44", value: 15 },
        { name: "45+", value: 10 },
      ],
      spending: [
        { name: "High Spenders", value: 20 },
        { name: "Medium Spenders", value: 45 },
        { name: "Low Spenders", value: 35 },
      ],
      lifetime: [
        { name: "New (<1m)", value: 25 },
        { name: "Growing (1-6m)", value: 35 },
        { name: "Loyal (>6m)", value: 40 },
      ],
      products: [
        { name: "Electronics", value: 40 },
        { name: "Fashion", value: 30 },
        { name: "Home & Living", value: 20 },
        { name: "Others", value: 10 },
      ],
      channels: [
        { name: "Organic Search", value: 35 },
        { name: "Social Media", value: 25 },
        { name: "Referral", value: 20 },
        { name: "Direct", value: 20 },
      ],
      conversion: [
        { name: "Organic", value: 30 },
        { name: "Paid", value: 25 },
        { name: "Email", value: 20 },
        { name: "Social Media", value: 15 },
        { name: "Referral", value: 10 },
      ],
    },
  },
  retentionData: {
    averageRetention: {
      cohort: "Average",
      newCustomers: 0,
      spend: 0,
      revenue: 0,
      days: [90.2, 71.5, 68.2, 66.7, 66.1, 58.7],
    },
    cohorts: [
      {
        cohort: "October 2023",
        newCustomers: 47,
        spend: 2350,
        revenue: 4700,
        days: [95.7, 85.1, 76.6, 72.3, 68.1, 57.4],
      },
      {
        cohort: "September 2023",
        newCustomers: 58,
        spend: 2900,
        revenue: 5800,
        days: [93.1, 82.8, 75.9, 70.7, 65.5, 60.3],
      },
      {
        cohort: "August 2023",
        newCustomers: 63,
        spend: 3150,
        revenue: 12600,
        days: [91.3, 80.2, 73.0, 68.3, 63.5, 58.7],
      },
      {
        cohort: "July 2023",
        newCustomers: 68,
        spend: 3400,
        revenue: 13600,
        days: [89.7, 77.9, 70.6, 66.2, 61.8, 57.4],
      },
      {
        cohort: "June 2023",
        newCustomers: 72,
        spend: 3600,
        revenue: 14400,
        days: [88.9, 76.4, 69.4, 65.3, 61.1, 56.9],
      },
      {
        cohort: "May 2023",
        newCustomers: 55,
        spend: 2750,
        revenue: 11000,
        days: [87.3, 74.5, 67.3, 63.6, 59.1, 54.5],
      },
    ],
  },
  churnData: [
    { month: "Jan", churnRate: 2.8 },
    { month: "Feb", churnRate: 3.2 },
    { month: "Mar", churnRate: 2.9 },
    { month: "Apr", churnRate: 3.5 },
    { month: "May", churnRate: 3.1 },
    { month: "Jun", churnRate: 2.7 },
    { month: "Jul", churnRate: 2.5 },
    { month: "Aug", churnRate: 2.3 },
  ],
  customerFinancialMetrics: {
    clv: {
      current: 850,
      previous: 790,
      trend: 7.6,
    },
    cac: {
      current: 125,
      previous: 135,
      trend: -7.4,
    },
    crc: {
      current: 45,
      previous: 48,
      trend: -6.3,
    },
    clvCacRatio: {
      current: 6.8,
      previous: 5.9,
      trend: 15.3,
    },
  },
  cacTrends: Array(10)
    .fill(null)
    .map((_, i) => {
      const dates = [
        "Jan 5",
        "Jan 15",
        "Jan 25",
        "Feb 1",
        "Feb 10",
        "Jan 5",
        "Jan 15",
        "Jan 25",
        "Feb 1",
        "Feb 10",
      ];
      return {
        date: dates[i],
        currentPeriod: 175 - (i % 5) * 5 + Math.sin(i) * 8,
        previousPeriod: 190 - (i % 5) * 4 + Math.cos(i) * 10,
        lastMonth: 205 - (i % 5) * 6 + Math.sin(i * 2) * 12,
        lastYear: 220 - (i % 5) * 7 + Math.cos(i * 2) * 15,
      };
    }),
};

const retentionData = {
  averageRetention: {
    cohort: "Average Retention",
    users: null,
    days: [91.0, 69.8, 67.5, 66.7, 66.1, 58.7],
  },
  cohorts: [
    {
      cohort: "October 20, 2023",
      users: 47,
      newCustomers: 47,
      spend: 2350,
      revenue: 4700,
      days: [95.7, 51.1, 44.7, 85.1, 80.9, 57.4],
    },
    {
      cohort: "October 21, 2023",
      users: 5,
      newCustomers: 5,
      spend: 250,
      revenue: 1000,
      days: [100, 80.0, 100, 80.0, 80.0, 60.0],
    },
    {
      cohort: "October 22, 2023",
      users: 8,
      newCustomers: 8,
      spend: 400,
      revenue: 1600,
      days: [75.0, 62.5, 50.0, 50.0, 37.5, null],
    },
    {
      cohort: "October 23, 2023",
      users: 68,
      newCustomers: 68,
      spend: 3400,
      revenue: 13600,
      days: [97.1, 80.9, 79.4, 51.5, null, null],
    },
    {
      cohort: "October 24, 2023",
      users: 63,
      newCustomers: 63,
      spend: 3150,
      revenue: 12600,
      days: [87.3, 87.3, 63.5, null, null, null],
    },
    {
      cohort: "October 25, 2023",
      users: 58,
      newCustomers: 58,
      spend: 2900,
      revenue: 11600,
      days: [89.7, 56.9, null, null, null, null],
    },
    {
      cohort: "October 26, 2023",
      users: 13,
      newCustomers: 13,
      spend: 650,
      revenue: 2600,
      days: [92.3, null, null, null, null, null],
    },
  ],
};

const repeatPurchaseData = [
  {
    id: "First Purchase",
    value: 15000,
    label: "First Purchase",
  },
  {
    id: "Second Purchase",
    value: 6750,
    label: "Second Purchase",
  },
  {
    id: "Third+ Purchase",
    value: 4200,
    label: "Third+ Purchase",
  },
];

const COLORS = ["#6D28D9", "#4F46E5", "#7C3AED", "#8B5CF6", "#A78BFA"];

const gradientDefs = (
  <defs>
    <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6D28D9" />
      <stop offset="100%" stopColor="#4F46E5" />
    </linearGradient>
    <linearGradient id="freeGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#EC4899" />
      <stop offset="100%" stopColor="#BE185D" />
    </linearGradient>
    <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#8B5CF6" />
      <stop offset="100%" stopColor="#6D28D9" />
    </linearGradient>
    <linearGradient id="newCustomerGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#c084fc" />
      <stop offset="100%" stopColor="#9333ea" />
    </linearGradient>
    <linearGradient id="repeatCustomerGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#818cf8" />
      <stop offset="100%" stopColor="#4f46e5" />
    </linearGradient>
  </defs>
);

const getRetentionColor = (value: number | null) => {
  if (value === null) return "bg-transparent";

  // Using consistent purple shades for both themes
  if (value >= 90) {
    return "bg-[#6D28D9] bg-opacity-90";
  } else if (value >= 80) {
    return "bg-[#7C3AED] bg-opacity-80";
  } else if (value >= 70) {
    return "bg-[#8B5CF6] bg-opacity-70";
  } else if (value >= 60) {
    return "bg-[#9333EA] bg-opacity-60";
  } else if (value >= 50) {
    return "bg-[#A855F7] bg-opacity-50";
  } else {
    return "bg-[#C084FC] bg-opacity-40";
  }
};

// Helper function to format numbers with K/M abbreviations
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatCurrency = (num: number): string => {
  return "$" + formatNumber(num);
};

const MiniBar = ({ value, total }: { value: number; total: number }) => {
  const { theme } = useTheme();
  const percentage = (value / total) * 100;
  return (
    <div className="flex items-center justify-end gap-3">
      <span
        className={cn(
          "min-w-[40px] text-right",
          theme === "dark" ? "text-purple-200" : "text-purple-700"
        )}
      >
        {value}
      </span>
      <div
        className={cn(
          "w-24 h-1 rounded",
          theme === "dark" ? "bg-[#6D28D9]/20" : "bg-purple-100"
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs min-w-[45px]",
          theme === "dark" ? "text-purple-300" : "text-purple-600"
        )}
      >
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
};

const purchaseData = {
  productPerformance: [
    {
      category: "Electronics",
      newCustomers: 2800,
      regularCustomers: 4200,
      vipCustomers: 6500,
    },
    {
      category: "Fashion",
      newCustomers: 3500,
      regularCustomers: 5100,
      vipCustomers: 4800,
    },
    {
      category: "Home & Living",
      newCustomers: 2200,
      regularCustomers: 3800,
      vipCustomers: 5200,
    },
    {
      category: "Beauty",
      newCustomers: 1800,
      regularCustomers: 2900,
      vipCustomers: 3600,
    },
  ],
  cartSizeData: [
    {
      segment: "New Customers",
      cartValue: 150,
      itemsPerOrder: 2.5,
    },
    {
      segment: "Regular Customers",
      cartValue: 280,
      itemsPerOrder: 3.8,
    },
    {
      segment: "VIP Customers",
      cartValue: 520,
      itemsPerOrder: 5.2,
    },
  ],
};

const CustomerAnalyticsDashboard = () => {
  const { theme } = useTheme();
  const [selectedSegment, setSelectedSegment] = useState("demographics");
  const [visibleLines, setVisibleLines] = useState({
    "Current Period": true,
    "Previous Period": true,
    "Last Month": true,
    "Last Year": true,
  });

  const toggleLine = (lineName: string) => {
    setVisibleLines((prev) => ({
      ...prev,
      [lineName]: !prev[lineName],
    }));
  };

  const getSegmentData = () => {
    const data = mockData.customerDistribution.data[selectedSegment];
    if (!data) return [];

    return data.map((item) => ({
      category: item.name,
      distribution: item.value,
      growth: Math.random() * 20 - 10,
    }));
  };

  const segmentData = useMemo(() => getSegmentData(), [selectedSegment]);
  const totalDistribution = useMemo(
    () => segmentData.reduce((sum, item) => sum + item.distribution, 0),
    [segmentData]
  );

  return (
    <div className="flex-1 space-y-4">
      <Card
        className={cn(
          theme === "dark"
            ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
            : "bg-white border-[#FFFFFF]/20"
        )}
      >
        <CardContent className="p-4">
          <section className="space-y-6">
            {/* Executive Summary Section */}
            <h2
              className={cn(
                theme === "dark"
                  ? "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 mb-4"
                  : "text-xl font-semibold text-black  mb-4"
              )}
            >
              Executive Summary
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Total Customers Card */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "dark" ? "text-purple-300" : "text-gray-700"
                        )}
                      >
                        Total Customers
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-purple-400" : "text-gray-500"
                        )}
                      >
                        Active customer base
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "text-xl font-bold",
                              theme === "dark"
                                ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-300"
                                : "text-gray-900"
                            )}
                          >
                            {mockData.customerMetrics.totalCustomers.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          theme === "dark"
                            ? "bg-gradient-to-br from-purple-500 to-purple-600 bg-opacity-10"
                            : "bg-purple-100"
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={cn(
                            "h-4 w-4",
                            theme === "dark" ? "text-white" : "text-purple-600"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New Customers Card */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "dark" ? "text-purple-300" : "text-gray-700"
                        )}
                      >
                        New Customers
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-purple-400" : "text-gray-500"
                        )}
                      >
                        Total new customer acquisitions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "text-xl font-bold",
                              theme === "dark"
                                ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-300"
                                : "text-gray-900"
                            )}
                          >
                            {mockData.customerMetrics.newCustomers.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          theme === "dark"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 bg-opacity-10"
                            : "bg-blue-100"
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={cn(
                            "h-4 w-4",
                            theme === "dark" ? "text-white" : "text-blue-600"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Repeat Customers Card */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "dark" ? "text-purple-300" : "text-gray-700"
                        )}
                      >
                        Repeat Customers
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-purple-400" : "text-gray-500"
                        )}
                      >
                        Returning customer count
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "text-xl font-bold",
                              theme === "dark"
                                ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-300"
                                : "text-gray-900"
                            )}
                          >
                            {mockData.customerMetrics.repeatCustomers.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          theme === "dark"
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 bg-opacity-10"
                            : "bg-emerald-100"
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={cn(
                            "h-4 w-4",
                            theme === "dark" ? "text-white" : "text-emerald-600"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Analytics Section */}
          <div className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Customer Split Card */}
              <Card
                className={cn(
                  "h-[420px]",
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      theme === "dark" ? "text-purple-300" : "text-gray-700"
                    )}
                  >
                    Customer Split
                  </CardTitle>
                  <p
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-purple-400" : "text-gray-500"
                    )}
                  >
                    Distribution of new vs repeat customers
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full flex justify-center">
                    <ResponsiveContainer width="85%" height="100%">
                      <PieChart>
                        <defs>
                          <linearGradient
                            id="newCustomerGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={
                                theme === "dark" ? "#c084fc" : "#9333EA"
                              }
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                theme === "dark" ? "#9333ea" : "#6D28D9"
                              }
                            />
                          </linearGradient>
                          <linearGradient
                            id="repeatCustomerGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={
                                theme === "dark" ? "#818cf8" : "#4F46E5"
                              }
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                theme === "dark" ? "#4f46e5" : "#3730A3"
                              }
                            />
                          </linearGradient>
                        </defs>
                        <Pie
                          data={[
                            {
                              name: "New Customers",
                              value: mockData.customerMetrics.newCustomers,
                              fill: "url(#newCustomerGradient)",
                            },
                            {
                              name: "Repeat Customers",
                              value: mockData.customerMetrics.repeatCustomers,
                              fill: "url(#repeatCustomerGradient)",
                            },
                          ]}
                          cx="50%"
                          cy="45%"
                          innerRadius={77}
                          outerRadius={104}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            {
                              name: "New Customers",
                              value: mockData.customerMetrics.newCustomers,
                              fill: "url(#newCustomerGradient)",
                            },
                            {
                              name: "Repeat Customers",
                              value: mockData.customerMetrics.repeatCustomers,
                              fill: "url(#repeatCustomerGradient)",
                            },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor:
                              theme === "dark"
                                ? "rgba(45, 27, 105, 0.9)"
                                : "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            border:
                              theme === "dark"
                                ? "1px solid rgba(109, 40, 217, 0.2)"
                                : "1px solid rgba(209, 213, 219, 0.5)",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          labelStyle={{
                            color: theme === "dark" ? "#A78BFA" : "#6B7280",
                          }}
                          itemStyle={{
                            color: theme === "dark" ? "#E9D5FF" : "#374151",
                          }}
                          formatter={(value: number) => [
                            `${(
                              (value /
                                mockData.customerMetrics.totalCustomers) *
                              100
                            ).toFixed(1)}%`,
                            "",
                          ]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          content={({ payload }) => (
                            <div className="flex justify-center gap-4 pt-4 pb-2">
                              {payload?.map((entry: any) => (
                                <div
                                  key={entry.value}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      background:
                                        entry.payload.name === "New Customers"
                                          ? theme === "dark"
                                            ? "linear-gradient(to bottom, #c084fc, #9333ea)"
                                            : "linear-gradient(to bottom, #9333EA, #6D28D9)"
                                          : theme === "dark"
                                          ? "linear-gradient(to bottom, #818cf8, #4f46e5)"
                                          : "linear-gradient(to bottom, #4F46E5, #3730A3)",
                                    }}
                                  />
                                  <span
                                    className={cn(
                                      "text-sm",
                                      theme === "dark"
                                        ? "text-purple-200"
                                        : "text-gray-700"
                                    )}
                                  >
                                    {entry.value}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-sm",
                                      theme === "dark"
                                        ? "text-purple-300/60"
                                        : "text-gray-500"
                                    )}
                                  >
                                    (
                                    {(
                                      (entry.payload.value /
                                        mockData.customerMetrics
                                          .totalCustomers) *
                                      100
                                    ).toFixed(1)}
                                    %)
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Distribution Table Card */}
              <Card
                className={cn(
                  "h-[420px]",
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      theme === "dark" ? "text-purple-300" : "text-gray-700"
                    )}
                  >
                    Customer Distribution
                  </CardTitle>
                  <p
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-purple-400" : "text-gray-500"
                    )}
                  >
                    Breakdown by customer segments and growth
                  </p>
                </CardHeader>
                <CardContent className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow
                        className={cn(
                          "border-b",
                          theme === "dark"
                            ? "border-purple-500/20"
                            : "border-gray-200"
                        )}
                      >
                        <TableHead
                          className={cn(
                            "h-12 px-4 text-left align-middle font-medium",
                            theme === "dark"
                              ? "bg-[#2D1B69]/40 border-r border-[#6D28D9]/20 text-purple-300"
                              : "border-r border-gray-200 text-gray-900",
                            "w-[220px]"
                          )}
                        >
                          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                            <SelectTrigger
                              className={cn(
                                "flex items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full h-8",
                                theme === "dark"
                                  ? "bg-[#1A0B2E] border-[#6D28D9]/20 text-purple-300"
                                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <SelectValue placeholder="Select segment" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockData.customerDistribution.segments.map((segment) => (
                                <SelectItem key={segment.value} value={segment.value}>
                                  {segment.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead
                          className={cn(
                            "text-right font-medium",
                            theme === "dark" ? "text-purple-300" : "text-gray-900"
                          )}
                        >
                          Distribution
                        </TableHead>
                        <TableHead
                          className={cn(
                            "text-right font-medium",
                            theme === "dark" ? "text-purple-300" : "text-gray-900"
                          )}
                        >
                          Growth
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {segmentData.map((item, index) => (
                        <TableRow
                          key={index}
                          className={cn(
                            "border-b transition-colors hover:bg-muted/50",
                            theme === "dark"
                              ? "border-purple-500/20"
                              : "border-gray-200",
                            theme === "dark"
                              ? "hover:bg-purple-900/10"
                              : "hover:bg-gray-100"
                          )}
                        >
                          <TableCell
                            className={cn(
                              "font-medium",
                              theme === "dark"
                                ? "text-purple-100"
                                : "text-gray-900"
                            )}
                          >
                            {item.category}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right tabular-nums",
                              theme === "dark"
                                ? "text-purple-100"
                                : "text-gray-900"
                            )}
                          >
                            <MiniBar
                              value={item.distribution}
                              total={totalDistribution}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span
                                className={
                                  item.growth >= 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              >
                                {Math.abs(item.growth).toFixed(1)}%
                              </span>
                              {item.growth >= 0 ? (
                                <ArrowUp className="text-green-400 h-4 w-4" />
                              ) : (
                                <ArrowDown className="text-red-400 h-4 w-4" />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customer Retention Section */}
          <div className="mt-6">
            <h2
              className={cn(
                theme === "dark"
                  ? "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 mb-4"
                  : "text-xl font-semibold text-black  mb-4"
              )}
            >
              Customer Retention
            </h2>

            {/* Cohort Analysis Card */}
            <Card
              className={cn(
                theme === "dark"
                  ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20 mb-6"
                  : "bg-white border-gray-200 mb-6"
              )}
            >
              <CardHeader>
                <CardTitle
                  className={cn(
                    theme === "dark"
                      ? "text-sm font-medium text-purple-300"
                      : "text-sm font-medium text-gray-700"
                  )}
                >
                  Cohort Retention Analysis
                </CardTitle>
                <p
                  className={cn(
                    theme === "dark"
                      ? "text-xs text-purple-400"
                      : "text-xs text-gray-500"
                  )}
                >
                  User retention analysis by cohort and month
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <div style={{ minWidth: "900px" }}>
                    <Table>
                      <TableHeader>
                        <TableRow
                          className={
                            theme === "dark"
                              ? "border-b border-[#6D28D9]/20"
                              : "border-b border-gray-200"
                          }
                        >
                          <TableHead
                            className={cn(
                              theme === "dark"
                                ? "text-purple-300 sticky left-0 bg-[#1A0B2E] z-10"
                                : "text-gray-900 sticky left-0 bg-white z-10"
                            )}
                          >
                            Cohort
                          </TableHead>
                          <TableHead
                            className={cn(
                              "text-right w-[140px]",
                              theme === "dark"
                                ? "text-purple-300 sticky left-[120px] bg-[#1A0B2E] z-10"
                                : "text-gray-900 sticky left-[120px] bg-white z-10"
                            )}
                          >
                            New
                          </TableHead>
                          <TableHead
                            className={cn(
                              "text-right",
                              theme === "dark"
                                ? "text-purple-300 sticky left-[200px] bg-[#1A0B2E] z-10"
                                : "text-gray-900 sticky left-[200px] bg-white z-10"
                            )}
                          >
                            Spend
                          </TableHead>
                          <TableHead
                            className={cn(
                              "text-right",
                              theme === "dark"
                                ? "text-purple-300 sticky left-[280px] bg-[#1A0B2E] z-10"
                                : "text-gray-900 sticky left-[280px] bg-white z-10"
                            )}
                          >
                            Rev
                          </TableHead>
                          <TableHead
                            className={cn(
                              "text-right",
                              theme === "dark"
                                ? "text-purple-300 sticky left-[360px] bg-[#1A0B2E] z-10"
                                : "text-gray-900 sticky left-[360px] bg-white z-10"
                            )}
                          >
                            CAC
                          </TableHead>
                          {[1, 2, 3, 4, 5, 6].map((month) => (
                            <TableHead
                              key={month}
                              className={cn(
                                "text-right min-w-[80px]",
                                theme === "dark"
                                  ? "text-purple-300"
                                  : "text-gray-900"
                              )}
                            >
                              M{month}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockData.retentionData.cohorts.map((cohort, index) => (
                          <TableRow
                            key={index}
                            className={cn(
                              theme === "dark"
                                ? "border-b border-[#6D28D9]/20 hover:bg-[#6D28D9]/5"
                                : "border-b border-gray-200 hover:bg-gray-50"
                            )}
                          >
                            <TableCell
                              className={cn(
                                theme === "dark"
                                  ? "text-purple-300 sticky left-0 bg-[#1A0B2E] z-10"
                                  : "text-gray-900 sticky left-0 bg-white z-10"
                              )}
                            >
                              {cohort.cohort}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right",
                                theme === "dark"
                                  ? "text-purple-300 sticky left-[120px] bg-[#1A0B2E] z-10"
                                  : "text-gray-900 sticky left-[120px] bg-white z-10"
                              )}
                            >
                              {formatNumber(cohort.newCustomers)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right",
                                theme === "dark"
                                  ? "text-purple-300 sticky left-[200px] bg-[#1A0B2E] z-10"
                                  : "text-gray-900 sticky left-[200px] bg-white z-10"
                              )}
                            >
                              {formatCurrency(cohort.spend)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right",
                                theme === "dark"
                                  ? "text-purple-300 sticky left-[280px] bg-[#1A0B2E] z-10"
                                  : "text-gray-900 sticky left-[280px] bg-white z-10"
                              )}
                            >
                              {formatCurrency(cohort.revenue)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right",
                                theme === "dark"
                                  ? "text-purple-300 sticky left-[360px] bg-[#1A0B2E] z-10"
                                  : "text-gray-900 sticky left-[360px] bg-white z-10"
                              )}
                            >
                              ${(cohort.spend / cohort.newCustomers).toFixed(0)}
                            </TableCell>
                            {cohort.days.map((value, dayIndex) => (
                              <TableCell
                                key={dayIndex}
                                className={cn(
                                  "text-right relative",
                                  getRetentionColor(value)
                                )}
                              >
                                <span
                                  className={cn(
                                    "relative z-10",
                                    value > 0
                                      ? theme === "dark"
                                        ? "text-purple-100 font-medium"
                                        : "text-purple-900 font-medium"
                                      : theme === "dark"
                                      ? "text-purple-300"
                                      : "text-gray-900"
                                  )}
                                >
                                  {value ? `${value.toFixed(1)}%` : "-"}
                                </span>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funnel and Churn Rate Row */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Repeat Purchase Funnel */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      theme === "dark" ? "text-purple-300" : "text-gray-700"
                    )}
                  >
                    Repeat Purchase Behavior
                  </CardTitle>
                  <p
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-purple-400" : "text-gray-500"
                    )}
                  >
                    Customer purchase frequency and retention analysis
                  </p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[320px]">
                    <FunnelChart
                      data={repeatPurchaseData}
                      colors={
                        theme === "dark"
                          ? ["#7C3AED", "#6D28D9", "#5B21B6"]
                          : ["#6366F1", "#4F46E5", "#4338CA"]
                      }
                      margin={{ top: 40, right: 20, bottom: 20, left: 20 }}
                      valueFormat={(value) => {
                        const maxValue = repeatPurchaseData[0].value;
                        return `${((value / maxValue) * 100).toFixed(1)}%`;
                      }}
                      defs={[
                        {
                          id: "gradient1",
                          type: "linearGradient",
                          colors:
                            theme === "dark"
                              ? [
                                  { offset: 0, color: "#7C3AED" },
                                  { offset: 100, color: "#6D28D9" },
                                ]
                              : [
                                  { offset: 0, color: "#6366F1" },
                                  { offset: 100, color: "#4F46E5" },
                                ],
                        },
                        {
                          id: "gradient2",
                          type: "linearGradient",
                          colors:
                            theme === "dark"
                              ? [
                                  { offset: 0, color: "#6D28D9" },
                                  { offset: 100, color: "#5B21B6" },
                                ]
                              : [
                                  { offset: 0, color: "#4F46E5" },
                                  { offset: 100, color: "#4338CA" },
                                ],
                        },
                        {
                          id: "gradient3",
                          type: "linearGradient",
                          colors:
                            theme === "dark"
                              ? [
                                  { offset: 0, color: "#5B21B6" },
                                  { offset: 100, color: "#4C1D95" },
                                ]
                              : [
                                  { offset: 0, color: "#4338CA" },
                                  { offset: 100, color: "#3730A3" },
                                ],
                        },
                      ]}
                      fill={[
                        { match: { id: "First Purchase" }, id: "gradient1" },
                        { match: { id: "Second Purchase" }, id: "gradient2" },
                        { match: { id: "Third+ Purchase" }, id: "gradient3" },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Churn Rate Chart */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      theme === "dark" ? "text-purple-300" : "text-gray-700"
                    )}
                  >
                    Customer Churn Rate
                  </CardTitle>
                  <p
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-purple-400" : "text-gray-500"
                    )}
                  >
                    Monthly customer churn analysis
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockData.churnData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme === "dark" ? "#6D28D9" : "#94A3B8"}
                          vertical={false}
                          opacity={theme === "dark" ? 0.1 : 0.2}
                        />
                        <XAxis
                          dataKey="month"
                          axisLine={{
                            stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                          }}
                          tickLine={{
                            stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                          }}
                          tick={{
                            fill: theme === "dark" ? "#E9D5FF" : "#1E293B",
                            fontSize: 12,
                          }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={{
                            stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                          }}
                          tickLine={{
                            stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                          }}
                          tick={{
                            fill: theme === "dark" ? "#E9D5FF" : "#1E293B",
                            fontSize: 12,
                          }}
                          dx={-10}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor:
                              theme === "dark"
                                ? "rgba(45, 27, 105, 0.9)"
                                : "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(8px)",
                            border:
                              theme === "dark"
                                ? "1px solid rgba(109, 40, 217, 0.2)"
                                : "1px solid rgba(71, 85, 105, 0.2)",
                            borderRadius: "12px",
                            boxShadow:
                              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          }}
                          labelStyle={{
                            color: theme === "dark" ? "#E9D5FF" : "#1E293B",
                            fontWeight: 500,
                            marginBottom: "4px",
                          }}
                          itemStyle={{
                            color: theme === "dark" ? "#E9D5FF" : "#1E293B",
                            padding: "2px 0",
                          }}
                          formatter={(value) => [`$${value}`, "Churn Rate"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="churnRate"
                          stroke={theme === "dark" ? "#6D28D9" : "#4F46E5"}
                          strokeWidth={2}
                          dot={{
                            fill: theme === "dark" ? "#1A0B2E" : "#F8FAFC",
                            stroke: theme === "dark" ? "#6D28D9" : "#4F46E5",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                            fill: theme === "dark" ? "#E9D5FF" : "#818CF8",
                            stroke: theme === "dark" ? "#6D28D9" : "#4F46E5",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customer Behavior Insights Section */}
          <div className="mt-8">
            <h2
              className={cn(
                theme === "dark"
                  ? "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 mb-4"
                  : "text-xl font-semibold text-black  mb-4"
              )}
            >
              Customer Behavior Insights
            </h2>

            {/* Purchase Behavior Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Top Selling Products by Segment */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      theme === "dark" ? "text-purple-300" : "text-gray-700"
                    )}
                  >
                    Product Performance by Customer Segment
                  </CardTitle>
                  <p
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-purple-400" : "text-gray-500"
                    )}
                  >
                    Top selling categories across different customer groups
                  </p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={purchaseData.productPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#6D28D9"
                          opacity={0.1}
                        />
                        <XAxis
                          dataKey="category"
                          stroke="#A78BFA"
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: "#6D28D9", opacity: 0.2 }}
                        />
                        <YAxis
                          stroke="#A78BFA"
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: "#6D28D9", opacity: 0.2 }}
                          tickFormatter={(value: number) => `${value / 1000}K`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1A0B2E",
                            border: "1px solid #6D28D9",
                            borderRadius: "6px",
                          }}
                          labelStyle={{ color: "#A78BFA" }}
                          itemStyle={{ color: "#A78BFA" }}
                          formatter={(value: number) => [
                            `${(value / 1000).toFixed(1)}K`,
                            "Sales",
                          ]}
                        />
                        <Legend wrapperStyle={{ color: "#A78BFA" }} />
                        <Bar
                          dataKey="newCustomers"
                          name="New Customers"
                          fill="#6D28D9"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="regularCustomers"
                          name="Regular Customers"
                          fill="#9333EA"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="vipCustomers"
                          name="VIP Customers"
                          fill="#A855F7"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Average Cart Size by Segment */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      theme === "dark" ? "text-purple-300" : "text-gray-700"
                    )}
                  >
                    Average Cart Size by Segment
                  </CardTitle>
                  <p
                    className={cn(
                      "text-xs",
                      theme === "dark" ? "text-purple-400" : "text-gray-500"
                    )}
                  >
                    Cart value and items per order across customer segments
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={purchaseData.cartSizeData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#6D28D9"
                          opacity={0.1}
                        />
                        <XAxis
                          dataKey="segment"
                          stroke="#A78BFA"
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: "#6D28D9", opacity: 0.2 }}
                        />
                        <YAxis
                          yAxisId="left"
                          stroke="#A78BFA"
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: "#6D28D9", opacity: 0.2 }}
                          tickFormatter={(value: number) => `$${value}`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#A78BFA"
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: "#6D28D9", opacity: 0.2 }}
                          tickFormatter={(value: number) => `${value} items`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1A0B2E",
                            border: "1px solid #6D28D9",
                            borderRadius: "6px",
                          }}
                          labelStyle={{ color: "#A78BFA" }}
                          itemStyle={{ color: "#A78BFA" }}
                        />
                        <Legend wrapperStyle={{ color: "#A78BFA" }} />
                        <Bar
                          yAxisId="left"
                          dataKey="cartValue"
                          name="Cart Value"
                          fill="#6D28D9"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="itemsPerOrder"
                          name="Items per Order"
                          fill="#9333EA"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Customer Financial Metrics */}
          <div className="mt-8">
            <h2
              className={cn(
                theme === "dark"
                  ? "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 mb-4"
                  : "text-xl font-semibold text-black  mb-4"
              )}
            >
              Customer Financial Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {/* Customer Lifetime Value (CLV) */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between h-[64px]">
                    <div className="flex flex-col space-y-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "dark" ? "text-purple-300" : "text-gray-700"
                        )}
                      >
                        Customer Lifetime Value
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-purple-400" : "text-gray-500"
                        )}
                      >
                        (CLV)
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        theme === "dark"
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
                          : "text-gray-900"
                      )}
                    >
                      ${mockData.customerFinancialMetrics.clv.current}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Acquisition Cost (CAC) */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between h-[64px]">
                    <div className="flex flex-col space-y-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "dark" ? "text-purple-300" : "text-gray-700"
                        )}
                      >
                        Customer Acquisition Cost
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-purple-400" : "text-gray-500"
                        )}
                      >
                        (CAC)
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        theme === "dark"
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
                          : "text-gray-900"
                      )}
                    >
                      ${mockData.customerFinancialMetrics.cac.current}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Retention Cost (CRC) */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between h-[64px]">
                    <div className="flex flex-col space-y-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "dark" ? "text-purple-300" : "text-gray-700"
                        )}
                      >
                        Customer Retention Cost
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-purple-400" : "text-gray-500"
                        )}
                      >
                        (CRC)
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        theme === "dark"
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
                          : "text-gray-900"
                      )}
                    >
                      ${mockData.customerFinancialMetrics.crc.current}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* CLV:CAC Ratio */}
              <Card
                className={cn(
                  theme === "dark"
                    ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                    : "bg-white border-gray-200"
                )}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between h-[64px]">
                    <div className="flex flex-col space-y-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          theme === "dark" ? "text-purple-300" : "text-gray-700"
                        )}
                      >
                        CLV to CAC Ratio
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          theme === "dark" ? "text-purple-400" : "text-gray-500"
                        )}
                      >
                        (CLV:CAC)
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        theme === "dark"
                          ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
                          : "text-gray-900"
                      )}
                    >
                      {mockData.customerFinancialMetrics.clvCacRatio.current}x
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CAC Trend Chart */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CAC Trend Chart */}
            <Card
              className={cn(
                theme === "dark"
                  ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                  : "bg-white border-gray-200"
              )}
            >
              <CardHeader>
                <h3
                  className={cn(
                    "text-sm font-medium",
                    theme === "dark" ? "text-purple-300" : "text-gray-700"
                  )}
                >
                  Customer Acquisition Cost Trends
                </h3>
                <p
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-purple-400" : "text-gray-500"
                  )}
                >
                  Monthly CAC analysis
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockData.cacTrends}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#6D28D9" : "#94A3B8"}
                        vertical={false}
                        opacity={theme === "dark" ? 0.1 : 0.2}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={{
                          stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                        }}
                        tickLine={{
                          stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                        }}
                        tick={{
                          fill: theme === "dark" ? "#E9D5FF" : "#1E293B",
                          fontSize: 12,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={{
                          stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                        }}
                        tickLine={{
                          stroke: theme === "dark" ? "#6D28D9" : "#64748B",
                        }}
                        tick={{
                          fill: theme === "dark" ? "#E9D5FF" : "#1E293B",
                          fontSize: 12,
                        }}
                        dx={-10}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor:
                            theme === "dark"
                              ? "rgba(45, 27, 105, 0.9)"
                              : "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(8px)",
                          border:
                            theme === "dark"
                              ? "1px solid rgba(109, 40, 217, 0.2)"
                              : "1px solid rgba(71, 85, 105, 0.2)",
                          borderRadius: "12px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                        labelStyle={{
                          color: theme === "dark" ? "#E9D5FF" : "#1E293B",
                          fontWeight: 500,
                          marginBottom: "4px",
                        }}
                        itemStyle={{
                          color: theme === "dark" ? "#E9D5FF" : "#1E293B",
                          padding: "2px 0",
                        }}
                        //@ts-ignore
                        formatter={(value) => [`$${value.toFixed(1)}`, "CAC"]}
                      />
                      <Line
                        name="Current Period"
                        type="monotone"
                        dataKey="currentPeriod"
                        stroke="#c084fc"
                        strokeWidth={2}
                        dot={{
                          fill: "#c084fc",
                          stroke: "#c084fc",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          fill: theme === "dark" ? "#E9D5FF" : "#818CF8",
                          stroke: "#c084fc",
                          strokeWidth: 2,
                        }}
                        hide={!visibleLines["Current Period"]}
                      />
                      <Line
                        name="Previous Period"
                        type="monotone"
                        dataKey="previousPeriod"
                        stroke="#818cf8"
                        strokeWidth={2}
                        dot={{
                          fill: "#818cf8",
                          stroke: "#818cf8",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          fill: theme === "dark" ? "#E9D5FF" : "#818CF8",
                          stroke: "#818cf8",
                          strokeWidth: 2,
                        }}
                        hide={!visibleLines["Previous Period"]}
                      />
                      <Line
                        name="Last Month"
                        type="monotone"
                        dataKey="lastMonth"
                        stroke="#f0abfc"
                        strokeWidth={2}
                        dot={{
                          fill: "#f0abfc",
                          stroke: "#f0abfc",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          fill: theme === "dark" ? "#E9D5FF" : "#818CF8",
                          stroke: "#f0abfc",
                          strokeWidth: 2,
                        }}
                        hide={!visibleLines["Last Month"]}
                      />
                      <Line
                        name="Last Year"
                        type="monotone"
                        dataKey="lastYear"
                        stroke="#fb7185"
                        strokeWidth={2}
                        dot={{
                          fill: "#fb7185",
                          stroke: "#fb7185",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          fill: theme === "dark" ? "#E9D5FF" : "#818CF8",
                          stroke: "#fb7185",
                          strokeWidth: 2,
                        }}
                        hide={!visibleLines["Last Year"]}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Button-style Legends */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  {[
                    { name: "Current Period", color: "#c084fc" },
                    { name: "Previous Period", color: "#818cf8" },
                    { name: "Last Month", color: "#f0abfc" },
                    { name: "Last Year", color: "#fb7185" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      onClick={() => toggleLine(item.name)}
                      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                        visibleLines[item.name]
                          ? "bg-[#2D1B69]/50 text-white"
                          : "text-purple-300/60 hover:text-purple-300"
                      }`}
                    >
                      {!visibleLines[item.name] && (
                        <div className="absolute inset-0 flex items-center pointer-events-none">
                          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent transform -rotate-6" />
                        </div>
                      )}
                      <span
                        className={`w-3 h-3 rounded-full transition-opacity duration-200 ${
                          !visibleLines[item.name] ? "opacity-40" : ""
                        }`}
                        style={{ backgroundColor: item.color }}
                      />
                      <span
                        className={`transition-opacity duration-200 ${
                          !visibleLines[item.name] ? "opacity-40" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CAC Distribution by Channel */}
            <Card
              className={cn(
                theme === "dark"
                  ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
                  : "bg-white border-gray-200"
              )}
            >
              <CardHeader>
                <h3
                  className={cn(
                    "text-sm font-medium",
                    theme === "dark" ? "text-purple-300" : "text-gray-700"
                  )}
                >
                  CAC by Channel
                </h3>
                <p
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-purple-400" : "text-gray-500"
                  )}
                >
                  Distribution across acquisition channels
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient
                          id="organicGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#c084fc" />
                          <stop offset="100%" stopColor="#9333ea" />
                        </linearGradient>
                        <linearGradient
                          id="paidGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                        <linearGradient
                          id="socialGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#f0abfc" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                        <linearGradient
                          id="referralGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#fb7185" />
                          <stop offset="100%" stopColor="#e11d48" />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={[
                          {
                            name: "Organic",
                            value: 30,
                            fill: "url(#organicGradient)",
                          },
                          {
                            name: "Paid",
                            value: 25,
                            fill: "url(#paidGradient)",
                          },
                          {
                            name: "Email",
                            value: 20,
                            fill: "url(#socialGradient)",
                          },
                          {
                            name: "Social Media",
                            value: 15,
                            fill: "url(#socialGradient)",
                          },
                          {
                            name: "Referral",
                            value: 10,
                            fill: "url(#referralGradient)",
                          },
                        ]}
                        cx="50%"
                        cy="45%"
                        innerRadius={77}
                        outerRadius={104}
                        paddingAngle={5}
                        dataKey="value"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(45, 27, 105, 0.9)",
                          borderRadius: "8px",
                          border: "1px solid rgba(109, 40, 217, 0.2)",
                        }}
                        labelStyle={{ color: "#A78BFA" }}
                        itemStyle={{ color: "#E9D5FF" }}
                        formatter={(value) => [`${value}%`, "of Total CAC"]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        content={({ payload }) => (
                          <div className="flex justify-center gap-4 pt-4 pb-2">
                            {payload?.map((entry: any) => (
                              <div
                                key={entry.value}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    background:
                                      entry.payload.name === "Organic"
                                        ? "linear-gradient(to bottom, #c084fc, #9333ea)"
                                        : entry.payload.name === "Paid"
                                        ? "linear-gradient(to bottom, #818cf8, #4f46e5)"
                                        : entry.payload.name === "Email" ||
                                          entry.payload.name === "Social Media"
                                        ? "linear-gradient(to bottom, #f0abfc, #d946ef)"
                                        : "linear-gradient(to bottom, #fb7185, #e11d48)",
                                  }}
                                />
                                <span
                                  className={cn(
                                    "text-sm",
                                    theme === "dark"
                                      ? "text-purple-200"
                                      : "text-gray-700"
                                  )}
                                >
                                  {entry.value}
                                </span>
                                <span
                                  className={cn(
                                    "text-sm",
                                    theme === "dark"
                                      ? "text-purple-300/60"
                                      : "text-gray-500"
                                  )}
                                >
                                  ({entry.payload.value}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAnalyticsDashboard;
