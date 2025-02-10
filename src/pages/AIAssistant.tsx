import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, LineChart, Database, Sparkles, Users2, TrendingUp, BarChart2, PieChart } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockCTRImpactData = [
  { date: '2024-01-01', currentCTR: 2.1, projectedCTR: 2.3 },
  { date: '2024-01-02', currentCTR: 2.2, projectedCTR: 2.5 },
  { date: '2024-01-03', currentCTR: 2.3, projectedCTR: 2.6 },
  { date: '2024-01-04', currentCTR: 2.2, projectedCTR: 2.7 },
  { date: '2024-01-05', currentCTR: 2.4, projectedCTR: 2.8 },
  { date: '2024-01-06', currentCTR: 2.3, projectedCTR: 2.9 },
  { date: '2024-01-07', currentCTR: 2.5, projectedCTR: 3.1 },
];

interface Message {
  type: 'user' | 'assistant';
  content: string;
  loading?: boolean;
  chartData?: any;
  explanation?: string;
}

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    
    // Clear input
    setInput('');
    
    // Show loading state
    setLoading(true);
    setMessages(prev => [...prev, {
      type: 'assistant',
      content: '',
      loading: true
    }]);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          type: 'assistant',
          content: 'Based on historical performance data, here\'s how a 15% budget increase could affect your CTR:',
          chartData: mockCTRImpactData,
          explanation: 'Analysis of the projected impact:\n\n• Current CTR: Average of 2.3%\n• Projected CTR: Expected to reach 3.1% (+35%)\n• Key Insight: The increased budget would allow for better ad placement and audience targeting, leading to higher engagement rates\n• Recommendation: Consider implementing the budget increase as the projected CTR shows consistent improvement over time.'
        };
        return newMessages;
      });
    }, 2000);
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className={cn(
      "min-h-screen w-full",
      isDark ? "bg-[#0F0B1E]" : "bg-gray-50"
    )}>
      <div className={cn(
        "flex flex-col h-[calc(100vh-2rem)] p-4 max-w-[95%] mx-auto",
        isDark ? "bg-transparent" : "bg-white rounded-lg shadow-sm"
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            isDark ? "bg-[#2D1B69]/30" : "bg-purple-50"
          )}>
            <Bot className={cn(
              "h-6 w-6",
              isDark ? "text-purple-400" : "text-purple-600"
            )} />
          </div>
          <div>
            <h1 className={cn(
              "text-2xl font-semibold",
              isDark ? "text-purple-200" : "text-gray-900"
            )}>AI Campaign Assistant</h1>
            <p className={cn(
              isDark ? "text-purple-300/80" : "text-gray-600"
            )}>Your personal AI-powered campaign analyst</p>
          </div>
        </div>

        {/* Chat Area */}
        <Card className={cn(
          "flex-1 mb-4 overflow-hidden h-[calc(100vh-11rem)]",
          isDark 
            ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20" 
            : "bg-white border-gray-200"
        )}>
          <CardContent className="p-4 h-full flex flex-col overflow-y-auto custom-scrollbar">
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: ${isDark ? 'rgba(109, 40, 217, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: ${isDark ? 'rgba(109, 40, 217, 0.5)' : 'rgba(107, 114, 128, 0.5)'};
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: ${isDark ? 'rgba(109, 40, 217, 0.7)' : 'rgba(107, 114, 128, 0.7)'};
              }
            `}</style>
            
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div className="space-y-4 w-full max-w-[1400px] mx-auto">
                  <Bot className={cn(
                    "h-12 w-12 mx-auto",
                    isDark ? "text-purple-400" : "text-purple-600"
                  )} />
                  <h2 className={cn(
                    "text-xl font-semibold",
                    isDark ? "text-purple-200" : "text-gray-900"
                  )}>How can I help you analyze your campaigns?</h2>
                  <p className={cn(
                    isDark ? "text-purple-300/80" : "text-gray-600"
                  )}>
                    Ask me anything about your campaign performance, metrics, or trends. I'll analyze the data and provide insights with visualizations.
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 mt-8">
                    <ExampleCard
                      icon={Users2}
                      title="Demographics"
                      description="What demographics are giving most performance for my campaign?"
                      onClick={() => handleExampleClick("What demographics are giving most performance for my campaign?")}
                      isDark={isDark}
                    />
                    <ExampleCard
                      icon={TrendingUp}
                      title="Ad Spend"
                      description="What would be effects of increasing ad spend by daily 15% on my campaigns?"
                      onClick={() => handleExampleClick("What would be effects of increasing ad spend by daily 15% on my campaigns?")}
                      isDark={isDark}
                    />
                    <ExampleCard
                      icon={BarChart2}
                      title="Campaign Performance"
                      description="Which ad placements are generating the highest click-through rates?"
                      onClick={() => handleExampleClick("Which ad placements are generating the highest click-through rates?")}
                      isDark={isDark}
                    />
                    <ExampleCard
                      icon={PieChart}
                      title="Creative Analysis"
                      description="What are the best performing ad creatives across my campaigns?"
                      onClick={() => handleExampleClick("What are the best performing ad creatives across my campaigns?")}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.type === 'user' ? 'ml-auto max-w-xl' : 'mr-auto max-w-2xl'}`}
              >
                {message.type === 'user' ? (
                  <div className={cn(
                    "p-3 rounded-lg",
                    isDark 
                      ? "bg-[#2D1B69] text-purple-200"
                      : "bg-purple-50 text-gray-900"
                  )}>
                    {message.content}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {message.loading ? (
                      <LoadingMessage isDark={isDark} />
                    ) : (
                      <>
                        <div className={cn(
                          "p-4 rounded-lg",
                          isDark 
                            ? "bg-[#2D1B69]/50 text-purple-200"
                            : "bg-purple-50 text-gray-900"
                        )}>
                          {message.content}
                          {message.chartData && (
                            <div className={cn(
                              "mt-4 h-[300px] p-4 rounded-lg",
                              isDark ? "bg-[#1A0B2E]" : "bg-white border border-gray-200"
                            )}>
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsLineChart data={message.chartData}>
                                  <defs>
                                    <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor={isDark ? "#4F46E5" : "#6366F1"} stopOpacity={0.3}/>
                                      <stop offset="100%" stopColor={isDark ? "#4F46E5" : "#6366F1"} stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor={isDark ? "#818CF8" : "#A5B4FC"} stopOpacity={0.3}/>
                                      <stop offset="100%" stopColor={isDark ? "#818CF8" : "#A5B4FC"} stopOpacity={0.1}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#6D28D9" : "#E5E7EB"} opacity={0.1} />
                                  <XAxis 
                                    dataKey="date" 
                                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                                    fontSize={12}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                  />
                                  <YAxis 
                                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                                    fontSize={12}
                                    tickFormatter={(value) => `${value}%`}
                                    label={{ 
                                      value: 'CTR', 
                                      angle: -90, 
                                      position: 'insideLeft', 
                                      fill: isDark ? "#9CA3AF" : "#6B7280"
                                    }}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: isDark ? '#2D1B69' : '#F3F4F6',
                                      border: isDark ? '1px solid rgba(109, 40, 217, 0.2)' : '1px solid rgba(209, 213, 219, 1)',
                                      borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: isDark ? '#E9D5FF' : '#374151' }}
                                    labelStyle={{ color: isDark ? '#E9D5FF' : '#374151' }}
                                    formatter={(value: number) => [`${value}%`, 'CTR']}
                                  />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="currentCTR"
                                    stroke={isDark ? "#4F46E5" : "#6366F1"}
                                    strokeWidth={2}
                                    dot={{ fill: isDark ? "#4F46E5" : "#6366F1", r: 4 }}
                                    name="Current CTR"
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="projectedCTR"
                                    stroke={isDark ? "#818CF8" : "#A5B4FC"}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ fill: isDark ? "#818CF8" : "#A5B4FC", r: 4 }}
                                    name="Projected CTR"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="currentCTR"
                                    fill="url(#currentGradient)"
                                    fillOpacity={0.3}
                                    stroke="none"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="projectedCTR"
                                    fill="url(#projectedGradient)"
                                    fillOpacity={0.3}
                                    stroke="none"
                                  />
                                </RechartsLineChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                          {message.explanation && (
                            <div className={cn(
                              "mt-4 p-3 rounded-lg",
                              isDark 
                                ? "bg-[#2D1B69]/30 text-purple-200"
                                : "bg-purple-50/50 text-gray-900"
                            )}>
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className={cn(
                                  "h-4 w-4",
                                  isDark ? "text-purple-400" : "text-purple-600"
                                )} />
                                <span className="font-medium">Analysis</span>
                              </div>
                              {message.explanation}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card className={cn(
          isDark 
            ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
            : "bg-white border-gray-200"
        )}>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your campaign performance..."
                className={cn(
                  "flex-1",
                  isDark 
                    ? "bg-[#2D1B69]/30 border-[#6D28D9]/20 text-purple-200 placeholder:text-purple-300/50"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                )}
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className={cn(
                  isDark
                    ? "bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoadingMessage({ isDark }: { isDark: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-lg flex items-center gap-3",
      isDark ? "bg-[#2D1B69]/50 text-purple-200" : "bg-purple-50 text-gray-900"
    )}>
      <div className="flex gap-1">
        <div className={cn(
          "w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]",
          isDark ? "bg-purple-400" : "bg-purple-600"
        )} />
        <div className={cn(
          "w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]",
          isDark ? "bg-purple-400" : "bg-purple-600"
        )} />
        <div className={cn(
          "w-2 h-2 rounded-full animate-bounce",
          isDark ? "bg-purple-400" : "bg-purple-600"
        )} />
      </div>
      <span className={isDark ? "text-purple-300/80" : "text-gray-600"}>
        Analyzing your campaign data...
      </span>
    </div>
  );
}

function ExampleCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  isDark
}: { 
  icon: any; 
  title: string; 
  description: string;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg text-left transition-all h-full flex flex-col flex-1",
        isDark 
          ? "bg-[#2D1B69]/30 border-[#6D28D9]/20 hover:bg-[#2D1B69]/50 hover:border-[#6D28D9]/40"
          : "bg-purple-50 border-purple-100 hover:bg-purple-100 hover:border-purple-200"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-lg w-fit",
        isDark ? "bg-[#2D1B69]/30" : "bg-purple-100"
      )}>
        <Icon className={cn(
          "h-4 w-4",
          isDark ? "text-purple-400" : "text-purple-600"
        )} />
      </div>
      <h3 className={cn(
        "font-medium text-sm mt-3 mb-1.5",
        isDark ? "text-purple-200" : "text-gray-900"
      )}>{title}</h3>
      <p className={cn(
        "text-xs leading-relaxed line-clamp-3",
        isDark ? "text-purple-300/80" : "text-gray-600"
      )}>{description}</p>
    </button>
  );
}
