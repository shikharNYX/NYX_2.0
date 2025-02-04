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
  return (
    <Card className="bg-[#1A0B2E]/80 border-[#6D28D9]/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
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
                background: rgba(109, 40, 217, 0.1);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(109, 40, 217, 0.2);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(109, 40, 217, 0.3);
              }
            `}
          </style>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Campaign</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">ROAS</TableHead>
                <TableHead className="w-[120px]">Spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium text-purple-300">
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${
                        campaign.status === 'active'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-purple-300">
                    {campaign.roas.toFixed(2)}x
                  </TableCell>
                  <TableCell className="text-purple-300">
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
