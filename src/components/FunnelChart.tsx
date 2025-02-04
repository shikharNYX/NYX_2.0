/**
 * @author Healium Digital
 * Funnel Chart Component
 * Visualizes conversion funnel with stages and metrics
 */

import React from 'react';
import { ResponsiveFunnel, FunnelDatum } from '@nivo/funnel';

interface FunnelData extends FunnelDatum {
  id: string;
  value: number;
  label: string;
  maxValue?: number;
}

interface TooltipProps {
  part: {
    data: FunnelData;
    formattedValue: string | number;
    color: string;
  };
}

const CustomTooltip = ({ part }: TooltipProps): JSX.Element | null => {
  if (!part || !part.data) return null;

  const maxValue = part.data.maxValue || part.data.value; 
  const percentage = ((part.data.value / maxValue) * 100).toFixed(1);

  return (
    <div className="bg-[#1A0B2E] text-white p-3 rounded-lg shadow-lg border border-[#4A148C]">
      <p className="font-bold text-base">
        {part.data.label} ({percentage}%)
      </p>
      <p className="text-sm mt-1">Value: {part.data.value.toLocaleString()}</p>
    </div>
  );
};

interface FunnelChartProps {
  data?: FunnelData[];
  colors?: string[];
  margin?: { top: number; right: number; bottom: number; left: number };
  direction?: 'horizontal' | 'vertical';
  interpolation?: 'smooth' | 'linear';
  valueFormat?: (value: number) => string;
  shapeBlending?: number;
  spacing?: number;
  borderWidth?: number;
  enableLabel?: boolean;
  labelColor?: string;
  labelPosition?: 'inside' | 'outside';
  theme?: any;
  defs?: any[];
  fill?: any[];
}

const FunnelChart = ({
  data = [
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
  ],
  colors = ["#2D1B69", "#4C1D95", "#6D28D9"],
  margin = { top: 40, right: 20, bottom: 20, left: 20 },
  direction = 'horizontal',
  interpolation = 'smooth',
  valueFormat = (value: number = 0) => {
    const maxValue = data[0].value;
    const percentage = ((value / maxValue) * 100).toFixed(1);
    return `${percentage}%`;
  },
  shapeBlending = 0.8,
  spacing = 4,
  borderWidth = 0,
  enableLabel = true,
  labelColor = "#E9D5FF",
  labelPosition = "inside",
  theme = {
    labels: {
      text: {
        fontSize: 14,
        fill: "#E9D5FF",
        fontWeight: 600,
      },
    },
  },
  defs = [
    {
      id: "gradient1",
      type: "linearGradient",
      colors: [
        { offset: 0, color: "#2D1B69" },
        { offset: 100, color: "#4C1D95" },
      ],
    },
    {
      id: "gradient2",
      type: "linearGradient",
      colors: [
        { offset: 0, color: "#4C1D95" },
        { offset: 100, color: "#6D28D9" },
      ],
    },
    {
      id: "gradient3",
      type: "linearGradient",
      colors: [
        { offset: 0, color: "#6D28D9" },
        { offset: 100, color: "#8B5CF6" },
      ],
    },
  ],
  fill = [
    { match: { id: "Impressions" }, id: "gradient1" },
    { match: { id: "Clicks" }, id: "gradient2" },
    { match: { id: "Conversions" }, id: "gradient3" },
  ],
}: FunnelChartProps): JSX.Element => {
  return (
    <div className="relative">
      {/* Section Labels */}
      <div className="absolute top-0 left-0 right-0 flex justify-between px-10 text-sm text-purple-200 font-medium">
        <span>First Purchase</span>
        <span>Second Purchase</span>
        <span>Third+ Purchase</span>
      </div>
      
      {/* Funnel Chart */}
      <div style={{ height: '320px' }}>
        <ResponsiveFunnel
          data={data}
          margin={margin}
          direction={direction}
          colors={colors}
          interpolation={interpolation}
          valueFormat={valueFormat}
          shapeBlending={shapeBlending}
          spacing={spacing}
          borderWidth={borderWidth}
          enableLabel={enableLabel}
          labelColor={labelColor}
          labelPosition={labelPosition}
          theme={theme}
          defs={defs}
          fill={fill}
          tooltip={CustomTooltip}
        />
      </div>
    </div>
  );
};

export default FunnelChart;
