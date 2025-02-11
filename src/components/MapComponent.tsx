/**
 * @author Healium Digital
 * Geographic Map Component
 * Displays regional performance data on an interactive world map
 */

import React from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import { regionData } from './RegionTable';
import { useTheme } from 'next-themes';
import cn from 'classnames';

const formatNumber = (num: number): string => {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
};

// Map region codes to our region names
const regionMapping = {
  'North America': ['US', 'CA'],
  'Latin America': ['MX', 'BR', 'AR', 'CO', 'CL', 'PE'],
  'Europe': ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'SE', 'NO', 'DK', 'PL'],
  'Asia Pacific': ['CN', 'JP', 'KR', 'IN', 'AU', 'SG', 'ID', 'MY', 'TH', 'VN', 'PH'],
  'Middle East': ['SA', 'AE', 'QA', 'KW', 'OM', 'BH', 'IL', 'TR']
};

export const MapComponent = () => {
  const { theme } = useTheme();

  const getRegionColor = (countryCode: string) => {
    const region = Object.entries(regionMapping).find(([_, countries]) => 
      countries.includes(countryCode)
    )?.[0];

    if (!region) return 0; // Return 0 for unknown regions

    const data = regionData.find(r => r.region === region);
    if (!data) return 0; // Return 0 if no data found

    const baseOpacity = 0.2 + (data.distribution * 0.8);
    return baseOpacity; // Return opacity as a numeric value
  };

  const handleRegionTipShow = (e: MouseEvent, el: Element, code: string) => {
    const region = Object.entries(regionMapping).find(([_, countries]) => 
      countries.includes(code)
    )?.[0];

    if (!region) return false;

    const data = regionData.find(r => r.region === region);
    if (!data) return false;

    // Update the tooltip element's HTML content
    el.innerHTML = `
      <div style="
        background-color: ${theme === 'dark' ? 'rgba(74, 20, 140, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
        color: ${theme === 'dark' ? 'white' : '#374151'};
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        border: 1px solid ${theme === 'dark' ? 'rgba(74, 20, 140, 0.9)' : 'rgba(229, 231, 235, 1)'};
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      ">
        <div style="font-size: 14px; margin-bottom: 5px;">${region}</div>
        <div style="font-size: 12px; opacity: 0.9;">Distribution: ${(data.distribution * 100).toFixed(1)}%</div>
        <div style="font-size: 12px; opacity: 0.9;">Impressions: ${formatNumber(data.impressions)}</div>
        <div style="font-size: 12px; opacity: 0.9;">Clicks: ${formatNumber(data.clicks)}</div>
        <div style="font-size: 12px; opacity: 0.9;">Conversions: ${formatNumber(data.conversions)}</div>
      </div>
    `;

    return true;
  };

  return (
    <div className={cn(
      "relative w-full h-[400px] rounded-lg p-4 border",
      theme === 'dark'
        ? "bg-[#2D1B4B] border-[#4A148C]"
        : "bg-white border-gray-200"
    )}>
      <div className="w-full h-full">
        <VectorMap
          map={worldMill}
          backgroundColor="transparent"
          zoomOnScroll={false}
          onRegionTipShow={handleRegionTipShow}
          regionStyle={{
            initial: {
              fill: theme === 'dark' ? '#1A0A2B' : '#F3F4F6',
              stroke: theme === 'dark' ? '#4A148C' : '#E5E7EB',
              strokeWidth: 0.5,
            },
            hover: {
              fill: theme === 'dark' ? '#6D28D9' : '#818CF8',
              fillOpacity: 0.8
            }
          }}
          series={{
            regions: [{
              values: Object.fromEntries(
                Object.values(regionMapping).flat().map(code => [
                  code,
                  getRegionColor(code)
                ])
              ),
              scale: theme === 'dark' 
                ? ['#2D1B69', '#4C1D95', '#6D28D9']
                : ['#C7D2FE', '#818CF8', '#4F46E5'],
              attribute: 'fill'
            }]
          }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};