import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Circle } from 'lucide-react';

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
  React.useEffect(() => {
    if (currentStep > steps.length) {
      onComplete();
    }
  }, [currentStep, onComplete]);

  return (
    <div className="relative p-6 bg-[#1A0B2E]/95 rounded-lg border border-[#6D28D9]/20">
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
          className="bg-purple-500/10 rounded-full p-3"
        >
          <Bot className="h-6 w-6 text-purple-400" />
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
                <div className="absolute left-[15px] top-[30px] w-[2px] h-[calc(100%+24px)] bg-[#6D28D9]/20">
                  {(isCompleted || isActive) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: isCompleted ? "100%" : "50%" }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 w-full bg-purple-500"
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
                      <CheckCircle2 className="h-8 w-8 text-purple-500" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="bg-purple-500/10 rounded-full p-1"
                    >
                      <Circle className="h-6 w-6 text-purple-400" />
                    </motion.div>
                  ) : (
                    <Circle className="h-8 w-8 text-[#6D28D9]/40" />
                  )}
                </div>

                {/* Step Content */}
                <div className={`flex-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  <motion.h4
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-lg font-medium text-purple-200"
                  >
                    {step.title}
                  </motion.h4>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm text-purple-300/80"
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
