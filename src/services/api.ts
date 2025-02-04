/**
 * @author Healium Digital
 * API Service
 */

import axios from "axios";
import {
  ChartDataResponse,
  DateRange,
  MetricDataResponse,
  RegionDataResponse,
  SegmentDataResponse,
} from "@/types/analytics";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized response
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await api.post("/auth/refresh", { refreshToken });
        const { token } = response.data;

        localStorage.setItem("auth_token", token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (error) {
        // Redirect to login on refresh token failure
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const analyticsApi = {
  // Get analytics data
  getAnalyticsChartData: async (
    filters: { platform?: string; dateRange: DateRange },
    period?: string
  ): Promise<ChartDataResponse> => {
    const { dateRange, platform } = filters;
    const response = await api.get("/analytics/chart", {
      params: {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        period,
        platform,
      },
    });
    return response.data;
  },

  getAnalyticsMetricData: async (filters: {
    platform?: string;
    dateRange: DateRange;
  }): Promise<MetricDataResponse> => {
    const { dateRange, platform } = filters;
    const response = await api.get("/analytics/metrics", {
      params: {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        platform,

      },
    });
    return response.data;
  },

  getAnalyticsSegmentData: async (filters: {
    platform?: string;
    dateRange: DateRange;
  }): Promise<SegmentDataResponse> => {
    const { dateRange, platform } = filters;

    const response = await api.get("/analytics/segments", {
      params: {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        platform,

      },
    });
    return response.data;
  },

  getAnalyticsRegionData: async (filters: {
    platform?: string;
    dateRange: DateRange;
  }): Promise<RegionDataResponse> => {
    const { dateRange, platform } = filters;

    const response = await api.get("/analytics/region", {
      params: {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        platform,
      },
    });
    return response.data;
  },
};

export default api;
