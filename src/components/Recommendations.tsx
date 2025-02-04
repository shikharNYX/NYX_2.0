import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSignIcon,
  Users2Icon,
  LayoutTemplateIcon,
  SlidersHorizontal
} from "lucide-react";

type RecommendationType = 'budget' | 'demographics' | 'content';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: string;
  type: RecommendationType;
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    title: "Optimize Campaign Budget",
    description: "Increase budget allocation for top performing ads",
    impact: "+15% ROAS",
    type: "budget"
  },
  {
    id: 2,
    title: "Target New Age Group",
    description: "Expand to 25-34 age group showing high engagement",
    impact: "+20% Reach",
    type: "demographics"
  },
  {
    id: 3,
    title: "Update Ad Creative",
    description: "Test video format for better engagement",
    impact: "+25% CTR",
    type: "content"
  }
];

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

export function Recommendations() {
  const handleApply = (id: number) => {
    // TODO: Implement recommendation application logic
    console.log(`Applying recommendation ${id}`);
  };

  return (
    <Card className="bg-[#1A0B2E]/80 border-[#6D28D9]/20 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
            AI Recommendations
          </CardTitle>
        </div>
        <CardDescription className="text-purple-300/80 text-sm">
          Smart suggestions to improve performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => {
          const config = typeConfig[rec.type];
          const Icon = config.icon;
          
          return (
            <div
              key={rec.id}
              className="p-3 rounded-lg bg-[#2D1B69]/30 border border-[#6D28D9]/20 hover:bg-[#2D1B69]/40 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.bgGradient}`}>
                  <Icon className={`h-4 w-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-purple-200 truncate">{rec.title}</h3>
                  <p className="text-xs text-purple-300/80 truncate">{rec.description}</p>
                  <p className="text-xs text-emerald-400 mt-0.5">{rec.impact}</p>
                </div>
                <Button
                  onClick={() => handleApply(rec.id)}
                  size="sm"
                  className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white px-3 h-7 text-xs`}
                >
                  Apply
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
