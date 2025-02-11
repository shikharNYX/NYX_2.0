import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Brain, Clock, BarChart2, DollarSign, Workflow, Users, Target } from "lucide-react";

// Mock data - Replace with actual API data
const aiStats = {
  timeSaved: {
    hours: 120,
    percentageIncrease: 25
  },
  effort: {
    percentage: 35,
    improvement: 15
  },
  costReduction: {
    amount: 15000,
    percentageSaved: 20
  },
  performanceImprovement: {
    percentage: 40,
    previousScore: 65
  },
  workflows: {
    active: 8,
    total: 12
  },
  agents: {
    active: 5,
    total: 7
  }
};

const StatCard = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon,
  gradient
}: { 
  title: string;
  value: string;
  subValue: string;
  icon: any;
  gradient: string;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card className={cn(
      "border",
      isDark ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20" : "bg-white border-gray-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className={cn(
              "text-xs",
              isDark ? "text-purple-300/80" : "text-gray-500"
            )}>{title}</span>
            <div className="flex items-baseline gap-1.5">
              <span className={cn(
                "text-xl font-bold",
                isDark
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-300"
                  : "text-gray-800"
              )}>
                {value}
              </span>
              <span className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              )}>
                {subValue}
              </span>
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-lg",
            isDark 
              ? `bg-gradient-to-br ${gradient} bg-opacity-10` 
              : "bg-gray-100"
          )}>
            <Icon className={cn(
              "h-4 w-4",
              isDark ? "text-white" : "text-gray-600"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function AIAgentStats() {
  const { theme } = useTheme();

  return (
    <Card className={cn(
      "border",
      theme === 'dark'
        ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
        : "bg-white border-gray-200"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Brain className={cn(
            "h-5 w-5",
            theme === 'dark' ? "text-purple-400" : "text-purple-600"
          )} />
          <CardTitle className={cn(
            "text-lg font-semibold",
            theme === 'dark'
              ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400"
              : "text-gray-800"
          )}>
            AI Agent Performance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title="Time Saved"
            value={`${aiStats.timeSaved.hours}h`}
            subValue={`+${aiStats.timeSaved.percentageIncrease}%`}
            icon={Clock}
            gradient="from-blue-400 to-blue-600"
          />
          <StatCard
            title="Effort Reduction"
            value={`${aiStats.effort.percentage}%`}
            subValue={`+${aiStats.effort.improvement}%`}
            icon={Target}
            gradient="from-purple-400 to-purple-600"
          />
          <StatCard
            title="Cost Savings"
            value={`$${aiStats.costReduction.amount.toLocaleString()}`}
            subValue={`${aiStats.costReduction.percentageSaved}%`}
            icon={DollarSign}
            gradient="from-emerald-400 to-emerald-600"
          />
          <StatCard
            title="Performance Impact"
            value={`${aiStats.performanceImprovement.percentage}%`}
            subValue={`+${aiStats.performanceImprovement.percentage - aiStats.performanceImprovement.previousScore}%`}
            icon={BarChart2}
            gradient="from-amber-400 to-amber-600"
          />
          <StatCard
            title="Active Workflows"
            value={`${aiStats.workflows.active}/${aiStats.workflows.total}`}
            subValue={`${Math.round((aiStats.workflows.active / aiStats.workflows.total) * 100)}% active`}
            icon={Workflow}
            gradient="from-rose-400 to-rose-600"
          />
          <StatCard
            title="AI Agents"
            value={`${aiStats.agents.active}/${aiStats.agents.total}`}
            subValue={`${Math.round((aiStats.agents.active / aiStats.agents.total) * 100)}% active`}
            icon={Users}
            gradient="from-indigo-400 to-indigo-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}
