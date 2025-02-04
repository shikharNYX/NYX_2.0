/**
 * @author Healium Digital
 * Region Table Component
 * Displays detailed regional performance metrics in a tabular format
 */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface RegionData {
  region: string;
  impressions: number;
  clicks: number;
  conversions: number;
  distribution: number;
  change: number;
}

const regionData: RegionData[] = [
  {
    region: "North America",
    impressions: 450000,
    clicks: 85000,
    conversions: 12500,
    distribution: 0.4,
    change: 15.3
  },
  {
    region: "Europe",
    impressions: 320000,
    clicks: 62000,
    conversions: 8750,
    distribution: 0.3,
    change: 12.7
  },
  {
    region: "Asia Pacific",
    impressions: 280000,
    clicks: 55000,
    conversions: 7200,
    distribution: 0.2,
    change: 10.5
  },
  {
    region: "Latin America",
    impressions: 180000,
    clicks: 35000,
    conversions: 4500,
    distribution: 0.1,
    change: 8.2
  },
  {
    region: "Middle East",
    impressions: 25000,
    clicks: 4000,
    conversions: 800,
    distribution: 0.06,
    change: 5.1
  },
  {
    region: "Middle East",
    impressions: 120000,
    clicks: 22000,
    conversions: 3200,
    distribution: 0.05,
    change: 5.1
  },
];

const formatNumber = (num: number) => {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
};

const formatDistribution = (dist: number) => {
  return `${(dist * 100).toFixed(1)}%`;
};

export function RegionTable() {
  return (
    <div className="w-full h-[400px] overflow-y-auto rounded-lg border border-[#4A148C] bg-[#2D1B4B]">
      <Table>
        <TableHeader className="sticky top-0 bg-[#2D1B4B] z-10">
          <TableRow className="hover:bg-[#4A148C]/50 border-[#4A148C]">
            <TableHead className="text-gray-300 w-[150px]">Region</TableHead>
            <TableHead className="text-gray-300 text-right w-[100px]">Impressions</TableHead>
            <TableHead className="text-gray-300 text-right w-[100px]">Clicks</TableHead>
            <TableHead className="text-gray-300 text-right w-[100px]">Conversions</TableHead>
            <TableHead className="text-gray-300 text-right w-[120px]">Distribution</TableHead>
            <TableHead className="text-gray-300 text-right w-[80px]">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regionData.map((region) => (
            <TableRow key={region.region} className="hover:bg-[#4A148C]/50 border-[#4A148C]">
              <TableCell className="font-medium text-white py-2">
                {region.region}
              </TableCell>
              <TableCell className="text-right text-white py-2">
                {formatNumber(region.impressions)}
              </TableCell>
              <TableCell className="text-right text-white py-2">
                {formatNumber(region.clicks)}
              </TableCell>
              <TableCell className="text-right text-white py-2">
                {formatNumber(region.conversions)}
              </TableCell>
              <TableCell className="text-right text-white py-2">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 bg-[#1A0A2B] h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4A148C]"
                      style={{ width: `${region.distribution * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">{formatDistribution(region.distribution)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right py-2">
                <span className={`inline-flex items-center gap-1 text-xs ${
                  region.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {region.change >= 0 ? (
                    <ArrowUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3" />
                  )}
                  {Math.abs(region.change)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export { regionData };