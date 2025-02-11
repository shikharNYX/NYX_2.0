import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { DollarSignIcon, Users2Icon, LayoutTemplateIcon, ClockIcon } from 'lucide-react';

interface UpdateLog {
  id: string;
  type: 'budget' | 'demographics' | 'content';
  description: string;
  timestamp: string;
  changes: {
    from: string;
    to: string;
  };
}

interface UpdateLogsProps {
  logs: UpdateLog[];
}

const typeConfig = {
  budget: {
    icon: DollarSignIcon,
    gradient: "from-emerald-400 to-emerald-600",
    bgGradient: "from-emerald-400/10 to-emerald-600/10",
    iconColor: "text-emerald-400",
    lightIconColor: "text-emerald-600",
  },
  demographics: {
    icon: Users2Icon,
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-400/10 to-blue-600/10",
    iconColor: "text-blue-400",
    lightIconColor: "text-blue-600",
  },
  content: {
    icon: LayoutTemplateIcon,
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-400/10 to-purple-600/10",
    iconColor: "text-purple-400",
    lightIconColor: "text-purple-600",
  }
};

export const UpdateLogs: React.FC<UpdateLogsProps> = ({ logs }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (logs.length === 0) {
    return (
      <div className={cn(
        "text-center py-4",
        isDark ? "text-purple-300" : "text-gray-500"
      )}>
        No recent updates available.
      </div>
    );
  }

  return (
    <Card className={cn(
      "border-purple-500/20 bg-[#1A0B2E]",
      theme === 'dark' ? "" : "bg-white"
    )}>
      <CardHeader className="p-3 pb-1">
        <CardTitle className={cn(
          "text-sm font-medium",
          isDark ? "text-purple-100" : "text-gray-600"
        )}>Update Logs</CardTitle>
        <CardDescription className={cn(
          "text-xs",
          isDark ? "text-purple-300/80" : "text-gray-500"
        )}>Recent changes made to the campaign</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="space-y-3">
          {logs.map((log) => {
            const config = typeConfig[log.type];
            const Icon = config.icon;
            
            return (
              <div
                key={log.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                  isDark
                    ? "border-purple-500/20 bg-purple-500/5"
                    : "border-gray-200 bg-gray-50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark 
                    ? `bg-gradient-to-br ${config.bgGradient}`
                    : `bg-gradient-to-br ${config.bgGradient}`
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    isDark ? config.iconColor : config.lightIconColor
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium",
                      isDark ? "text-gray-100" : "text-gray-800"
                    )}>
                      {log.description}
                    </p>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <ClockIcon className={cn(
                        "h-3 w-3",
                        isDark ? "text-purple-400" : "text-purple-600"
                      )} />
                      <span className={cn(
                        "text-xs",
                        isDark ? "text-purple-300" : "text-gray-500"
                      )}>
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className={cn(
                      isDark ? "text-purple-300" : "text-gray-500"
                    )}>
                      Changed from:
                    </span>
                    <span className={cn(
                      "font-medium",
                      isDark ? "text-gray-300" : "text-gray-600"
                    )}>
                      {log.changes.from}
                    </span>
                    <span className={cn(
                      isDark ? "text-purple-300" : "text-gray-500"
                    )}>
                      to:
                    </span>
                    <span className={cn(
                      "font-medium",
                      isDark ? "text-gray-300" : "text-gray-600"
                    )}>
                      {log.changes.to}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdateLogs;
