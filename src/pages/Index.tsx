/**
 * @author Healium Digital
 * Main dashboard page component
 * Handles tab navigation and date range selection
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import CustomerAnalyticsDashboard from '@/components/CustomerAnalyticsDashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Index = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(1999, 1, 1),
    to: new Date(),
  });

  // State for channel selection
  const [selectedChannel, setSelectedChannel] = useState("all");

  // State for selected metrics (e.g., Impressions, Clicks, etc.)
  const [selectedMetrics, setSelectedMetrics] = useState(["Impressions"]);

  // State for date range type (e.g., Last 7 days, Last 30 days, etc.)
  const [dateRangeType, setDateRangeType] = useState("allTime");

  // State for custom date range (only used when "Custom Range" is selected)
  const [customDateRange, setCustomDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
  });

  // Function to toggle metrics selection
  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  // Handle channel selection
  const handleChannelChange = (value: string) => {
    setSelectedChannel(value);
  };

  // Handle date range type change
  const handleDateRangeTypeChange = (value: string) => {
    setDateRangeType(value);
    if (value !== "custom") {
      // Adjust date range for predefined types (Last 7, Last 30, Last 90)
      const today = new Date();
      if (value === "last7") {
        setDateRange({
          from: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 7
          ),
          to: today,
        });
      } else if (value === "last30") {
        setDateRange({
          from: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 30
          ),
          to: today,
        });
      } else if (value === "last90") {
        setDateRange({
          from: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 90
          ),
          to: today,
        });
      } else if (value === "allTime") {
        setDateRange({ from: new Date(1999, 1, 1), to: today });
      }
    }
  };

  // Handle custom date range change
  const handleCustomDateChange = (from: Date, to: Date) => {
    setCustomDateRange({ from, to });
    setDateRange({ from, to });
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col">
          {/* Title and Export */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
              Analytics Dashboard
            </h1>
            <button className="px-4 py-2 text-sm font-medium text-purple-300 bg-[#2D1B69]/30 rounded-lg border border-[#6D28D9]/20 hover:bg-[#2D1B69]/50 transition-all duration-200">
              Export Report
            </button>
          </div>

          {/* Navigation and Filters */}
          <div className="flex flex-col gap-6">
            {/* Tab Navigation */}
            <Tabs defaultValue="campaign" className="w-full">
              <TabsList className="flex w-fit space-x-8 mb-6 bg-transparent border-b border-[#6D28D9]/20 h-auto p-0">
                <TabsTrigger 
                  value="campaign" 
                  className="relative px-4 py-2 text-lg font-medium text-purple-300/60 hover:text-purple-300 data-[state=active]:text-purple-300 data-[state=active]:shadow-none bg-transparent border-0 transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#6D28D9] after:to-[#4F46E5] after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Campaign Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="customer" 
                  className="relative px-4 py-2 text-lg font-medium text-purple-300/60 hover:text-purple-300 data-[state=active]:text-purple-300 data-[state=active]:shadow-none bg-transparent border-0 transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-[#6D28D9] after:to-[#4F46E5] after:opacity-0 data-[state=active]:after:opacity-100"
                >
                  Customer Analytics
                </TabsTrigger>
              </TabsList>

              {/* Filters */}
              <div className="flex items-center gap-4">
                {/* Channel Filter */}
                <Select
                  value={selectedChannel}
                  onValueChange={handleChannelChange}
                >
                  <SelectTrigger className="w-[200px] bg-[#2D1B69]/30 text-purple-300 border-[#6D28D9]/20 hover:bg-[#2D1B69]/50 transition-all duration-200">
                    <SelectValue>
                      {selectedChannel === "all"
                        ? "All Channels"
                        : selectedChannel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A0B2E] border-[#6D28D9]/20">
                    <SelectItem
                      value="all"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      All Channels
                    </SelectItem>
                    <SelectItem
                      value="google"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      Google
                    </SelectItem>
                    <SelectItem
                      value="meta"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      Meta
                    </SelectItem>
                    <SelectItem
                      value="linkedin"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      LinkedIn
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range Filter */}
                <Select
                  value={dateRangeType}
                  onValueChange={handleDateRangeTypeChange}
                >
                  <SelectTrigger className="w-[160px] bg-[#2D1B69]/30 text-purple-300 border-[#6D28D9]/20 hover:bg-[#2D1B69]/50 transition-all duration-200">
                    <SelectValue>
                      {dateRangeType === "custom"
                        ? "Custom Range"
                        : dateRangeType.toLocaleUpperCase()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A0B2E] border-[#6D28D9]/20">
                    <SelectItem
                      value="allTime"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      All Time
                    </SelectItem>
                    <SelectItem
                      value="last7"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      Last 7 Days
                    </SelectItem>
                    <SelectItem
                      value="last30"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      Last 30 Days
                    </SelectItem>
                    <SelectItem
                      value="last90"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      Last 90 Days
                    </SelectItem>
                    <SelectItem
                      value="custom"
                      className="text-purple-300 focus:bg-[#2D1B69]/30 focus:text-purple-300"
                    >
                      Custom Range
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Picker when 'Custom' is selected */}
              {dateRangeType === "custom" && (
                <div className="flex gap-4 mt-4">
                  <DatePicker
                    selected={customDateRange.from}
                    onChange={(date: Date) =>
                      handleCustomDateChange(date, customDateRange.to)
                    }
                    dateFormat="yyyy-MM-dd"
                    className="px-4 py-2 bg-[#2D1B69] text-purple-300 border-[#6D28D9] rounded-lg"
                  />
                  <DatePicker
                    selected={customDateRange.to}
                    onChange={(date: Date) =>
                      handleCustomDateChange(customDateRange.from, date)
                    }
                    dateFormat="yyyy-MM-dd"
                    className="px-4 py-2 bg-[#2D1B69] text-purple-300 border-[#6D28D9] rounded-lg"
                  />
                </div>
              )}

              {/* Tab Contents */}
              <TabsContent value="campaign">
                <AnalyticsDashboard dateRange={dateRange} platform={selectedChannel} />
              </TabsContent>
              
              <TabsContent value="customer">
                <CustomerAnalyticsDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
