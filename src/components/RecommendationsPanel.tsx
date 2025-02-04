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
    iconColor: "text-emerald-400"
  },
  demographics: {
    icon: Users2Icon,
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-400/10 to-blue-600/10",
    iconColor: "text-blue-400"
  },
  content: {
    icon: LayoutTemplateIcon,
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-400/10 to-purple-600/10",
    iconColor: "text-purple-400"
  }
};

const getImpactColor = (direction: 'up' | 'down') => {
  return direction === 'up' ? 'text-green-400' : 'text-red-400';
};

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  onApplyRecommendation,
}) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-center text-purple-300 py-4">
        No recommendations available at this time.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {recommendations.map((recommendation) => {
        const config = typeConfig[recommendation.type];
        const Icon = config.icon;
        
        return (
          <Card
            key={recommendation.id}
            className="border border-purple-500/20 hover:bg-purple-500/5 transition-colors"
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.bgGradient}`}>
                  <Icon className={`h-4 w-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0 flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-start gap-1.5">
                      <h3 className="font-medium text-gray-100 text-sm leading-tight truncate">
                        {recommendation.description}
                      </h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">{recommendation.details}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="mt-1 text-xs">
                      <span className="text-purple-300">Impact: </span>
                      <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                        {recommendation.impact.metric}: {recommendation.impact.value}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => onApplyRecommendation(recommendation)}
                    className="h-[2.75rem] px-3 text-xs bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 whitespace-nowrap"
                    size="sm"
                  >
                    Apply
                  </Button>
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
