/**
 * @author Healium Digital
 * Geographic Map Component
 * Displays regional performance data on an interactive world map
 */

import React from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import { regionData } from './RegionTable';

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
      <div style="background-color: rgba(74, 20, 140, 0.9); color: white; padding: 10px; border-radius: 5px; font-family: Arial, sans-serif;">
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
    <div className="relative w-full h-[400px] bg-[#2D1B4B] rounded-lg p-4 border border-[#4A148C]">
      <div className="w-full h-full">
        <VectorMap
          map={worldMill}
          backgroundColor="transparent"
          zoomOnScroll={false}
          onRegionTipShow={handleRegionTipShow}
          regionStyle={{
            initial: {
              fill: '#1A0A2B',
              stroke: '#4A148C',
              strokeWidth: 0.5,
            },
            hover: {
              fill: '#6D28D9',
              fillOpacity: 0.8
            }
          }}
          series={{
            regions: [{
              values: Object.fromEntries(
                Object.values(regionMapping).flat().map(code => [
                  code,
                  getRegionColor(code) // This now returns a numeric value
                ])
              ),
              attribute: 'fill'
            }]
          }}
          className="w-full h-full"
        />
      </div>

      {/* <div className="absolute bottom-4 left-4 flex gap-4 text-sm bg-[#4A148C]/90 backdrop-blur-sm p-2 rounded-lg border border-[#4A148C] custom-scrollbar">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(109, 40, 217, 0.2)' }}></div>
          <span className="text-gray-300">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(109, 40, 217, 0.5)' }}></div>
          <span className="text-gray-300">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(109, 40, 217, 0.8)' }}></div>
          <span className="text-gray-300">High</span>
        </div>
      </div> */}
    </div>
  );
};