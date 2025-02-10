import React from 'react';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSignIcon, Users2Icon, LayoutTemplateIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface Recommendation {
  id: string;
  campaignId: number;
  type: 'budget' | 'content' | 'demographics';
  description: string;
  impact: {
    metric: string;
    value: string;
    direction: 'up' | 'down';
  };
  details: string;
  changes?: any;
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (recommendation: Recommendation) => void;
}

const typeConfig = {
  budget: {
    icon: DollarSignIcon,
    gradient: "from-emerald-400 to-emerald-600",
    bgGradient: "from-emerald-400/10 to-emerald-600/10",
    iconColor: "text-emerald-400",
    lightGradient: "from-emerald-50 to-emerald-100",
    lightBgGradient: "from-emerald-50 to-emerald-100",
    lightIconColor: "text-emerald-600",
    lightHoverBg: "hover:bg-emerald-50"
  },
  demographics: {
    icon: Users2Icon,
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-400/10 to-blue-600/10",
    iconColor: "text-blue-400",
    lightGradient: "from-blue-50 to-blue-100",
    lightBgGradient: "from-blue-50 to-blue-100",
    lightIconColor: "text-blue-600",
    lightHoverBg: "hover:bg-blue-50"
  },
  content: {
    icon: LayoutTemplateIcon,
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-400/10 to-purple-600/10",
    iconColor: "text-purple-400",
    lightGradient: "from-purple-50 to-purple-100",
    lightBgGradient: "from-purple-50 to-purple-100",
    lightIconColor: "text-purple-600",
    lightHoverBg: "hover:bg-purple-50"
  }
};

const getImpactColor = (direction: 'up' | 'down', isDark: boolean) => {
  if (isDark) {
    return direction === 'up' ? 'text-green-400' : 'text-red-400';
  }
  return direction === 'up' ? 'text-green-600' : 'text-red-600';
};

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  onApplyRecommendation,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (recommendations.length === 0) {
    return (
      <div className={cn(
        "text-center py-4",
        isDark ? "text-purple-300" : "text-gray-500"
      )}>
        No recommendations available at this time.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {recommendations.map((recommendation) => {
        const config = typeConfig[recommendation.type];
        const Icon = config.icon;
        
        return (
          <Card
            key={recommendation.id}
            className={cn(
              "border transition-colors w-full",
              isDark
                ? "border-purple-500/20 hover:bg-purple-500/5"
                : "border-gray-200 bg-white",
              !isDark && config.lightHoverBg
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark 
                    ? `bg-gradient-to-br ${config.bgGradient}`
                    : `bg-gradient-to-br ${config.lightBgGradient}`
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    isDark ? config.iconColor : config.lightIconColor
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1.5">
                        <h3 className={cn(
                          "font-medium text-sm leading-tight",
                          isDark ? "text-gray-100" : "text-gray-800"
                        )}>
                          {recommendation.description}
                        </h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className={cn(
                                "h-4 w-4 flex-shrink-0 mt-0.5",
                                isDark ? "text-purple-400" : "text-purple-600"
                              )} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className={cn(
                                "text-sm max-w-xs",
                                isDark ? "text-gray-100" : "text-gray-800"
                              )}>{recommendation.details}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={cn(
                          "text-sm",
                          isDark ? "text-purple-300" : "text-gray-600"
                        )}>{recommendation.impact.metric}:</span>
                        <span className={cn(
                          "text-sm font-medium",
                          getImpactColor(recommendation.impact.direction, isDark)
                        )}>{recommendation.impact.value}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onApplyRecommendation(recommendation)}
                      className={cn(
                        "px-3 py-1.5 h-auto text-sm font-medium whitespace-nowrap",
                        isDark
                          ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-200"
                          : `bg-${recommendation.type === 'budget' ? 'emerald' : recommendation.type === 'demographics' ? 'blue' : 'purple'}-50 hover:bg-${recommendation.type === 'budget' ? 'emerald' : recommendation.type === 'demographics' ? 'blue' : 'purple'}-100 text-${recommendation.type === 'budget' ? 'emerald' : recommendation.type === 'demographics' ? 'blue' : 'purple'}-700`
                      )}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RecommendationsPanel;
