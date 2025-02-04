import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, LineChart, Database, Sparkles, Users2, TrendingUp, BarChart2, PieChart } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, defs, linearGradient, stop } from 'recharts';

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
    <div className="flex flex-col h-[calc(100vh-2rem)] p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#2D1B69]/30">
          <Bot className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-purple-200">AI Campaign Assistant</h1>
          <p className="text-purple-300/80">Your personal AI-powered campaign analyst</p>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 bg-[#1A0B2E]/80 border-[#6D28D9]/20 mb-4 overflow-hidden h-[calc(100vh-11rem)]">
        <CardContent className="p-4 h-full flex flex-col overflow-y-auto custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(109, 40, 217, 0.1);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(109, 40, 217, 0.5);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(109, 40, 217, 0.7);
            }
          `}</style>
          
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="space-y-4 w-full max-w-[1400px] mx-auto">
                <Bot className="h-12 w-12 text-purple-400 mx-auto" />
                <h2 className="text-xl font-semibold text-purple-200">How can I help you analyze your campaigns?</h2>
                <p className="text-purple-300/80">
                  Ask me anything about your campaign performance, metrics, or trends. I'll analyze the data and provide insights with visualizations.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-8">
                  <ExampleCard
                    icon={Users2}
                    title="Demographics"
                    description="What demographics are giving most performance for my campaign?"
                    onClick={() => handleExampleClick("What demographics are giving most performance for my campaign?")}
                  />
                  <ExampleCard
                    icon={TrendingUp}
                    title="Ad Spend"
                    description="What would be effects of increasing ad spend by daily 15% on my campaigns?"
                    onClick={() => handleExampleClick("What would be effects of increasing ad spend by daily 15% on my campaigns?")}
                  />
                  <ExampleCard
                    icon={BarChart2}
                    title="ROAS"
                    description="List my top performing campaigns with respect to ROAS."
                    onClick={() => handleExampleClick("List my top performing campaigns with respect to ROAS.")}
                  />
                  <ExampleCard
                    icon={PieChart}
                    title="Budget Split"
                    description="What should be my ideal budget distribution?"
                    onClick={() => handleExampleClick("What should be my ideal budget distribution?")}
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
                <div className="bg-[#2D1B69] text-purple-200 p-3 rounded-lg">
                  {message.content}
                </div>
              ) : (
                <div className="space-y-4">
                  {message.loading ? (
                    <LoadingMessage />
                  ) : (
                    <>
                      <div className="bg-[#2D1B69]/50 text-purple-200 p-4 rounded-lg">
                        {message.content}
                        {message.chartData && (
                          <div className="mt-4 h-[300px] bg-[#1A0B2E] p-4 rounded-lg">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart data={message.chartData}>
                                <defs>
                                  <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3}/>
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                  </linearGradient>
                                  <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818CF8" stopOpacity={0.3}/>
                                    <stop offset="100%" stopColor="#818CF8" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#6D28D9" opacity={0.1} />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#9CA3AF" 
                                  fontSize={12}
                                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <YAxis 
                                  stroke="#9CA3AF" 
                                  fontSize={12}
                                  tickFormatter={(value) => `${value}%`}
                                  label={{ value: 'CTR', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: '#2D1B69',
                                    border: '1px solid rgba(109, 40, 217, 0.2)',
                                    borderRadius: '8px'
                                  }}
                                  itemStyle={{ color: '#E9D5FF' }}
                                  labelStyle={{ color: '#E9D5FF' }}
                                  formatter={(value: number) => [`${value}%`, 'CTR']}
                                />
                                <Legend />
                                <Area
                                  type="monotone"
                                  dataKey="currentCTR"
                                  fill="url(#currentGradient)"
                                  fillOpacity={1}
                                  stroke="#4F46E5"
                                  strokeWidth={2}
                                  dot={{ fill: '#4F46E5', r: 4 }}
                                  name="Current"
                                />
                                <Area
                                  type="monotone"
                                  dataKey="projectedCTR"
                                  fill="url(#projectedGradient)"
                                  fillOpacity={1}
                                  stroke="#818CF8"
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  dot={{ fill: '#818CF8', r: 4 }}
                                  name="Projected"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="currentCTR"
                                  stroke="#4F46E5"
                                  strokeWidth={2}
                                  dot={{ fill: '#4F46E5', r: 4 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="projectedCTR"
                                  stroke="#818CF8"
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  dot={{ fill: '#818CF8', r: 4 }}
                                />
                              </RechartsLineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                        {message.explanation && (
                          <div className="mt-4 p-3 bg-[#2D1B69]/30 rounded-lg text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-purple-400" />
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
      <Card className="bg-[#1A0B2E]/80 border-[#6D28D9]/20">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your campaign performance..."
              className="flex-1 bg-[#2D1B69]/30 border-[#6D28D9]/20 text-purple-200 placeholder:text-purple-300/50"
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="bg-[#2D1B69]/50 text-purple-200 p-4 rounded-lg flex items-center gap-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
      </div>
      <span className="text-purple-300/80">Analyzing your campaign data...</span>
    </div>
  );
}

function ExampleCard({ icon: Icon, title, description, onClick }: { 
  icon: any; 
  title: string; 
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-[#2D1B69]/30 p-4 rounded-lg border border-[#6D28D9]/20 text-left transition-all hover:bg-[#2D1B69]/50 hover:border-[#6D28D9]/40 h-full flex flex-col flex-1"
    >
      <div className="p-1.5 rounded-lg bg-[#2D1B69]/30 w-fit">
        <Icon className="h-4 w-4 text-purple-400" />
      </div>
      <h3 className="font-medium text-purple-200 text-sm mt-3 mb-1.5">{title}</h3>
      <p className="text-xs text-purple-300/80 leading-relaxed line-clamp-3">{description}</p>
    </button>
  );
}
