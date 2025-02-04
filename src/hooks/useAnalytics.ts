/**
 * @author Healium Digital
 * Analytics Hook
 */

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/services/api';
import { DateRange } from '@/types/analytics';

export function useAnalytics(
  filters: {
    dateRange: DateRange;
    platform?: string;
  },
  period?: string
) {
  // Fetch main analytics data
  const chartData = useQuery({
    queryKey: ["chartData", period, filters],
    queryFn: () => analyticsApi.getAnalyticsChartData(filters, period),
  });

  const metricData = useQuery({
    queryKey: ["metricData", filters],
    queryFn: () => analyticsApi.getAnalyticsMetricData(filters),
  });

  const segmentData = useQuery({
    queryKey: ["segmentData", filters],
    queryFn: () => analyticsApi.getAnalyticsSegmentData(filters),
  });

  const regionData = useQuery({
    queryKey: ["regionData", filters],
    queryFn: () => analyticsApi.getAnalyticsRegionData(filters),
  });

  return {
    chartData,
    metricData,
    segmentData,
    regionData,
    isLoading: chartData.isLoading, // || regionalPerformance.isLoading || funnelData.isLoading,
    isError: chartData.isError, // || regionalPerformance.isError || funnelData.isError,
    error: chartData.error, //|| regionalPerformance.error || funnelData.error,
  };
} 
