/**
 * @author Healium Digital
 * Analytics Types
 */

export interface DateRange {
  from: Date;
  to: Date;
}

export interface MetricData {
  label: string;
  value: number;
  change: number;
}

export interface ChartData {
  name: string;
  value: number;
  value2: number;
}

export interface CountryPerformance {
  name: string;
  flag: string;
  value: string;
  change: number;
  positive: boolean;
  status: "High" | "Medium" | "Low";
}

export interface FunnelData {
  name: string;
  value: number;
  percentage: string;
  fill: string;
}

export interface SegmentData {
  [groupBy: string]: Partial<ChartData & { label: string; change: number }>[];
}

export interface RegionData {
  [user_location_country: string]: {
    label: string;
    data: { [x: string]: Partial<MetricData & { perc: number }> };
  }[];
}

export interface ChartDataResponse {
  chartData: ChartData[];
}
export interface MetricDataResponse {
  metrics: MetricData[];
}
export interface SegmentDataResponse {
  segments: SegmentData;
}
export interface RegionDataResponse {
  region: RegionData;
}
