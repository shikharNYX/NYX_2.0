/**
 * @author Healium Digital
 * Region Distribution Component
 * Shows distribution of metrics across different regions with interactive filters
 */

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

type Metric = 'ctr' | 'cpc' | 'cpm';

const regions = [
  { 
    country: 'United States',
    flag: '🇺🇸',
    metrics: { ctr: '19.39%', cpc: '$0.45', cpm: '$4.50' },
    change: { ctr: 23.48, cpc: 15.2, cpm: 18.5 },
    positive: { ctr: true, cpc: true, cpm: true }
  },
  { 
    country: 'United Kingdom',
    flag: '🇬🇧',
    metrics: { ctr: '6.30%', cpc: '$0.32', cpm: '$3.20' },
    change: { ctr: -3.45, cpc: -2.1, cpm: -1.8 },
    positive: { ctr: false, cpc: false, cpm: false }
  },
  { 
    country: 'Netherlands',
    flag: '🇳🇱',
    metrics: { ctr: '4.98%', cpc: '$0.28', cpm: '$2.80' },
    change: { ctr: 23.56, cpc: 12.3, cpm: 15.7 },
    positive: { ctr: true, cpc: true, cpm: true }
  },
  { 
    country: 'Canada',
    flag: '🇨🇦',
    metrics: { ctr: '4.32%', cpc: '$0.30', cpm: '$3.00' },
    change: { ctr: -39.44, cpc: -22.5, cpm: -25.8 },
    positive: { ctr: false, cpc: false, cpm: false }
  },
  { 
    country: 'France',
    flag: '🇫🇷',
    metrics: { ctr: '3.64%', cpc: '$0.25', cpm: '$2.50' },
    change: { ctr: -6.48, cpc: -4.2, cpm: -3.9 },
    positive: { ctr: false, cpc: false, cpm: false }
  }
];

export function RegionDistribution() {
  const [selectedMetric, setSelectedMetric] = useState<Metric>('ctr');

  const getMetricLabel = (metric: Metric) => {
    switch(metric) {
      case 'ctr': return 'Traffic Share';
      case 'cpc': return 'Cost per Click';
      case 'cpm': return 'Cost per Mile';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Region distribution by:</h2>
        <Select 
          defaultValue={selectedMetric}
          onValueChange={(value: Metric) => setSelectedMetric(value)}
        >
          <SelectTrigger className="w-[180px] bg-amber-100 text-gray-900">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ctr">CTR</SelectItem>
            <SelectItem value="cpc">CPC</SelectItem>
            <SelectItem value="cpm">CPM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>{getMetricLabel(selectedMetric)}</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.map((region) => (
              <TableRow key={region.country}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{region.flag}</span>
                    <span>{region.country}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: region.metrics[selectedMetric].replace(/[^0-9.]/g, '') + '%'
                        }}
                      />
                    </div>
                    <span>{region.metrics[selectedMetric]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`flex items-center gap-1 ${
                    region.positive[selectedMetric] ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {region.positive[selectedMetric] ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                    {Math.abs(region.change[selectedMetric])}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <img 
          src="/Healium/b1bec151-7efb-4650-a40a-2d463d69bc96.png" 
          alt="Region Map" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </Card>
  );
}