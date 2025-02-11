/**
 * @author Healium Digital
 * Funnel Chart Component
 * Visualizes conversion funnel with stages and metrics
 */

import React from 'react';
import { ResponsiveFunnel, FunnelDatum } from '@nivo/funnel';
import { useTheme } from 'next-themes';
import cn from 'classnames';

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
  const { theme } = useTheme();
  if (!part || !part.data) return null;

  const maxValue = part.data.maxValue || part.data.value; 
  const percentage = ((part.data.value / maxValue) * 100).toFixed(1);

  return (
    <div className={cn(
      "p-3 rounded-lg shadow-lg border",
      theme === 'dark'
        ? "bg-[#1A0B2E] text-white border-[#4A148C]"
        : "bg-white text-gray-900 border-gray-200"
    )}>
      <p className="font-bold text-base">
        {part.data.label} ({percentage}%)
      </p>
      <p className={cn(
        "text-sm mt-1",
        theme === 'dark' ? "text-gray-200" : "text-gray-600"
      )}>
        Value: {part.data.value.toLocaleString()}
      </p>
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
  labelColor?;
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
  colors,
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
  labelColor,
  labelPosition = "inside",
  theme: customTheme,
  defs,
  fill,
}: FunnelChartProps): JSX.Element => {
  const { theme } = useTheme();

  const defaultColors = theme === 'dark' 
    ? ["#2D1B69", "#4C1D95", "#6D28D9"]
    : ["#4F46E5", "#6D28D9", "#8B5CF6"];

  const defaultDefs = theme === 'dark' 
    ? [
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
      ]
    : [
        {
          id: "gradient1",
          type: "linearGradient",
          colors: [
            { offset: 0, color: "#4F46E5" },
            { offset: 100, color: "#6D28D9" },
          ],
        },
        {
          id: "gradient2",
          type: "linearGradient",
          colors: [
            { offset: 0, color: "#6D28D9" },
            { offset: 100, color: "#8B5CF6" },
          ],
        },
        {
          id: "gradient3",
          type: "linearGradient",
          colors: [
            { offset: 0, color: "#8B5CF6" },
            { offset: 100, color: "#A78BFA" },
          ],
        },
      ];

  const defaultFill = [
    { match: { id: "Impressions" }, id: "gradient1" },
    { match: { id: "Clicks" }, id: "gradient2" },
    { match: { id: "Conversions" }, id: "gradient3" },
  ];
  
  const chartTheme = {
    labels: {
      text: {
        fontSize: 14,
        fill: theme === 'dark' ? "#E9D5FF" : "#374151",
        fontWeight: 600,
      },
    },
    ...customTheme,
  };

  return (
    <div className={cn(
      "relative",
      theme === 'dark' ? "bg-[#1A0B2E]" : "bg-white"
    )}>
      {/* Section Labels */}
      <div className={cn(
        "absolute top-0 left-0 right-0 flex justify-between px-10 text-sm font-medium",
        theme === 'dark' ? "text-purple-200" : "text-gray-600"
      )}>
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
          colors={colors || defaultColors}
          interpolation={interpolation}
          valueFormat={valueFormat}
          shapeBlending={shapeBlending}
          spacing={spacing}
          borderWidth={borderWidth}
          enableLabel={enableLabel}
          labelColor={theme === 'dark' ? "#E9D5FF" : "#374151"}
          labelPosition={labelPosition}
          theme={chartTheme}
          defs={defs || defaultDefs}
          fill={fill || defaultFill}
          tooltip={CustomTooltip}
        />
      </div>
    </div>
  );
};

export default FunnelChart;
