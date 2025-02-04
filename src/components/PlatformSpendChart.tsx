import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Meta', value: 45000, color: '#4F46E5' },
  { name: 'Google', value: 35000, color: '#EC4899' },
  { name: 'LinkedIn', value: 20000, color: '#06B6D4' }
];

export function PlatformSpendChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="bg-[#1A0B2E]/80 border-[#6D28D9]/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
          Platform Spend Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[calc(100%-4rem)]">
        <div className="flex-1 min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={85}
                outerRadius={115}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(45, 27, 105, 0.9)',
                  borderRadius: '8px',
                  border: '1px solid rgba(109, 40, 217, 0.2)',
                }}
                formatter={(value: number) => [`$${(value).toLocaleString()}`, 'Spend']}
                itemStyle={{ color: '#E9D5FF' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 pt-4 pb-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-purple-200">
                {entry.name}
              </span>
              <span className="text-sm text-purple-300/60">
                ({Math.round(entry.value / total * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
