import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Circle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface RecommendationProgressProps {
  steps: Step[];
  currentStep: number;
  onComplete: () => void;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Analyzing Campaign Data",
    description: "Evaluating performance metrics and historical data"
  },
  {
    id: 2,
    title: "Optimizing Budget Allocation",
    description: "Adjusting budget distribution for maximum ROI"
  },
  {
    id: 3,
    title: "Updating Targeting Parameters",
    description: "Refining audience segments and demographics"
  },
  {
    id: 4,
    title: "Implementing Changes",
    description: "Applying optimized settings to your campaign"
  }
];

export function RecommendationProgress({
  currentStep,
  onComplete
}: RecommendationProgressProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  React.useEffect(() => {
    if (currentStep > steps.length) {
      onComplete();
    }
  }, [currentStep, onComplete, steps.length]);

  return (
    <div className={cn(
      "relative p-6 rounded-lg border",
      isDark 
        ? "bg-[#1A0B2E]/95 border-[#6D28D9]/20"
        : "bg-white border-gray-200"
    )}>
      {/* AI Agent Animation */}
      <div className="absolute top-0 right-0 p-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "rounded-full p-3",
            isDark ? "bg-purple-500/10" : "bg-purple-100"
          )}
        >
          <Bot className={cn(
            "h-6 w-6",
            isDark ? "text-purple-400" : "text-purple-600"
          )} />
        </motion.div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-6 mt-2">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="relative">
              {/* Progress Line */}
              {step.id !== steps.length && (
                <div className={cn(
                  "absolute left-[15px] top-[30px] w-[2px] h-[calc(100%+24px)]",
                  isDark ? "bg-[#6D28D9]/20" : "bg-gray-200"
                )}>
                  {(isCompleted || isActive) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isCompleted ? "100%" : "50%" }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "absolute top-0 left-0 w-full",
                        isDark ? "bg-purple-500" : "bg-purple-600"
                      )}
                    />
                  )}
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Step Status Icon */}
                <div className="relative z-10">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      <CheckCircle2 className={cn(
                        "h-8 w-8",
                        isDark ? "text-purple-500" : "text-purple-600"
                      )} />
                    </motion.div>
                  ) : (
                    <Circle className={cn(
                      "h-8 w-8",
                      isActive
                        ? isDark ? "text-purple-400" : "text-purple-600"
                        : isDark ? "text-purple-500/20" : "text-gray-300"
                    )} />
                  )}
                </div>

                {/* Step Content */}
                <div>
                  <h4 className={cn(
                    "font-medium",
                    isDark ? "text-purple-200" : "text-gray-900"
                  )}>{step.title}</h4>
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-purple-300/80" : "text-gray-600"
                  )}>{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
