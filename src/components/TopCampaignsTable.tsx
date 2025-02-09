import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  roas: number;
  spend: number;
  status: 'active' | 'paused';
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2025',
    roas: 3.5,
    spend: 25000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Brand Awareness Q1',
    roas: 2.8,
    spend: 18000,
    status: 'active'
  },
  {
    id: '3',
    name: 'Product Launch',
    roas: 1.9,
    spend: 15000,
    status: 'paused'
  },
  {
    id: '4',
    name: 'Retargeting - Website',
    roas: 4.2,
    spend: 12000,
    status: 'active'
  },
  {
    id: '5',
    name: 'Holiday Special',
    roas: 2.1,
    spend: 10000,
    status: 'paused'
  }
];

export function TopCampaignsTable() {
  const { theme } = useTheme();

  return (
    <Card className={cn(
      "border h-full",
      theme === 'dark'
        ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
        : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-lg font-semibold",
          theme === 'dark'
            ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
            : "text-gray-800"
        )}>
          Top Campaigns by Spend
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <div className="h-full overflow-auto custom-scrollbar">
          {/* Custom scrollbar styles */}
          <style>
            {`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: ${theme === 'dark' ? 'rgba(109, 40, 217, 0.1)' : 'rgba(229, 231, 235, 0.5)'};
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: ${theme === 'dark' ? 'rgba(109, 40, 217, 0.2)' : 'rgba(156, 163, 175, 0.5)'};
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: ${theme === 'dark' ? 'rgba(109, 40, 217, 0.3)' : 'rgba(156, 163, 175, 0.7)'};
              }
            `}
          </style>
          <Table>
            <TableHeader>
              <TableRow className={cn(
                theme === 'dark'
                  ? "border-[#6D28D9]/20 hover:bg-[#2D1B69]/30"
                  : "border-gray-200 hover:bg-gray-50"
              )}>
                <TableHead className={cn(
                  "w-[250px]",
                  theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
                )}>Campaign</TableHead>
                <TableHead className={cn(
                  "w-[120px]",
                  theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
                )}>Status</TableHead>
                <TableHead className={cn(
                  "w-[120px]",
                  theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
                )}>ROAS</TableHead>
                <TableHead className={cn(
                  "w-[120px]",
                  theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
                )}>Spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow 
                  key={campaign.id}
                  className={cn(
                    theme === 'dark'
                      ? "border-[#6D28D9]/20 hover:bg-[#2D1B69]/30"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <TableCell className={cn(
                    "font-medium",
                    theme === 'dark' ? "text-purple-300" : "text-gray-700"
                  )}>
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={campaign.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        "capitalize",
                        campaign.status === 'active'
                          ? theme === 'dark'
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : theme === 'dark'
                            ? "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    theme === 'dark' ? "text-purple-300" : "text-gray-700"
                  )}>
                    {campaign.roas.toFixed(1)}x
                  </TableCell>
                  <TableCell className={cn(
                    theme === 'dark' ? "text-purple-300" : "text-gray-700"
                  )}>
                    ${campaign.spend.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
