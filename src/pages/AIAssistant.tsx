import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Send,
  Sparkles,
  Users2,
  TrendingUp,
  BarChart2,
  PieChart,
} from "lucide-react";
// import {
//   LineChart as RechartsLineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Area,
// } from "recharts";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockCTRImpactData = [
  { date: "2024-01-01", currentCTR: 2.1, projectedCTR: 2.3 },
  { date: "2024-01-02", currentCTR: 2.2, projectedCTR: 2.5 },
  { date: "2024-01-03", currentCTR: 2.3, projectedCTR: 2.6 },
  { date: "2024-01-04", currentCTR: 2.2, projectedCTR: 2.7 },
  { date: "2024-01-05", currentCTR: 2.4, projectedCTR: 2.8 },
  { date: "2024-01-06", currentCTR: 2.3, projectedCTR: 2.9 },
  { date: "2024-01-07", currentCTR: 2.5, projectedCTR: 3.1 },
];

interface Message {
  type: "user" | "assistant";
  content: string;
  loading?: boolean;
  chartData?: any;
  explanation?: string;
  chartDetails?: any;
}

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: input }]);

    // Clear input
    setInput("");

    // Show loading state
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        content: "",
        loading: true,
      },
    ]);

    // WebSocket call
    const socket = new WebSocket(
      "wss://nyx-ai-api.test.nyx.today/nyx-ai-chatbot-agents/chat/2156545051397647"
    );

    // Payload to send
    const data = {
      user_query: input,
    };

    socket.onopen = () => {
      console.log("WebSocket connection established");
      socket.send(JSON.stringify(data)); // Send the user query payload
    };

    // Handle incoming messages from the WebSocket server
    socket.onmessage = (event) => {
      const serverResponse = JSON.parse(event.data); // Parse the response

      console.log("Final Response", serverResponse.final_response);
      console.log("Data", serverResponse);

      if (serverResponse.final_response == true) {
        

        const formattedData = serverResponse.structured_data.x_values.map(
          (label, index) => ({
            name: label,
            value: serverResponse.structured_data.y_values[index],
          })
        );

        setLoading(false);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            type: "assistant",
            content:
              "Based on historical performance data, here's how a 15% budget increase could affect your CTR:",
            chartData: formattedData,
            chartDetails: serverResponse.structured_data,
            //chartData: mockCTRImpactData,
            explanation: serverResponse.summary,
          };
          return newMessages;
        });
      }
    };

    socket.onerror = (error) => {
      setLoading(false);
      console.error("WebSocket error:", error);
    };

    // Handle WebSocket close event
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        isDark ? "bg-[#0F0B1E]" : "bg-gray-50"
      )}
    >
      <div
        className={cn(
          "flex flex-col h-[calc(100vh-2rem)] p-4 max-w-[95%] mx-auto",
          isDark ? "bg-transparent" : "bg-white rounded-lg shadow-sm"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "p-2 rounded-lg",
              isDark ? "bg-[#2D1B69]/30" : "bg-purple-50"
            )}
          >
            <Bot
              className={cn(
                "h-6 w-6",
                isDark ? "text-purple-400" : "text-purple-600"
              )}
            />
          </div>
          <div>
            <h1
              className={cn(
                "text-2xl font-semibold",
                isDark ? "text-purple-200" : "text-gray-900"
              )}
            >
              AI Campaign Assistant
            </h1>
            <p className={cn(isDark ? "text-purple-300/80" : "text-gray-600")}>
              Your personal AI-powered campaign analyst
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <Card
          className={cn(
            "flex-1 mb-4 overflow-hidden h-[calc(100vh-11rem)]",
            isDark
              ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
              : "bg-white border-gray-200"
          )}
        >
          <CardContent className="p-4 h-full flex flex-col overflow-y-auto custom-scrollbar">
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: ${
                  isDark
                    ? "rgba(109, 40, 217, 0.1)"
                    : "rgba(107, 114, 128, 0.1)"
                };
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: ${
                  isDark
                    ? "rgba(109, 40, 217, 0.5)"
                    : "rgba(107, 114, 128, 0.5)"
                };
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: ${
                  isDark
                    ? "rgba(109, 40, 217, 0.7)"
                    : "rgba(107, 114, 128, 0.7)"
                };
              }
            `}</style>

            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div className="space-y-4 w-full max-w-[1400px] mx-auto">
                  <Bot
                    className={cn(
                      "h-12 w-12 mx-auto",
                      isDark ? "text-purple-400" : "text-purple-600"
                    )}
                  />
                  <h2
                    className={cn(
                      "text-xl font-semibold",
                      isDark ? "text-purple-200" : "text-gray-900"
                    )}
                  >
                    How can I help you analyze your campaigns?
                  </h2>
                  <p
                    className={cn(
                      isDark ? "text-purple-300/80" : "text-gray-600"
                    )}
                  >
                    Ask me anything about your campaign performance, metrics, or
                    trends. I'll analyze the data and provide insights with
                    visualizations.
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 mt-8">
                    <ExampleCard
                      icon={Users2}
                      title="Demographics"
                      description="What demographics are giving most performance for my campaign?"
                      onClick={() =>
                        handleExampleClick(
                          "What demographics are giving most performance for my campaign?"
                        )
                      }
                      isDark={isDark}
                    />
                    <ExampleCard
                      icon={TrendingUp}
                      title="Ad Spend"
                      description="What would be effects of increasing ad spend by daily 15% on my campaigns?"
                      onClick={() =>
                        handleExampleClick(
                          "What would be effects of increasing ad spend by daily 15% on my campaigns?"
                        )
                      }
                      isDark={isDark}
                    />
                    <ExampleCard
                      icon={BarChart2}
                      title="Campaign Performance"
                      description="Which ad placements are generating the highest click-through rates?"
                      onClick={() =>
                        handleExampleClick(
                          "Which ad placements are generating the highest click-through rates?"
                        )
                      }
                      isDark={isDark}
                    />
                    <ExampleCard
                      icon={PieChart}
                      title="Creative Analysis"
                      description="What are the best performing ad creatives across my campaigns?"
                      onClick={() =>
                        handleExampleClick(
                          "What are the best performing ad creatives across my campaigns?"
                        )
                      }
                      isDark={isDark}
                    />
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user"
                    ? "ml-auto max-w-xl"
                    : "mr-auto max-w-2xl"
                }`}
              >
                {message.type === "user" ? (
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      isDark
                        ? "bg-[#2D1B69] text-purple-200"
                        : "bg-purple-50 text-gray-900"
                    )}
                  >
                    {message.content}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {message.loading ? (
                      <LoadingMessage isDark={isDark} />
                    ) : (
                      <>
                        <div
                          className={cn(
                            "p-4 rounded-lg",
                            isDark
                              ? "bg-[#2D1B69]/50 text-purple-200"
                              : "bg-purple-50 text-gray-900"
                          )}
                        >
                          {message.content}
                          {message.chartData && (
                            <div
                              className={cn(
                                "mt-4 h-[300px] p-4 rounded-lg",
                                isDark
                                  ? "bg-[#1A0B2E]"
                                  : "bg-white border border-gray-200"
                              )}
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                {message.chartDetails.plot_type === "bar" ? (
                                  <BarChart data={message.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                      dataKey="name"
                                      tick={{ fontSize: 12 }}
                                      interval={0}
                                      angle={-20}
                                      textAnchor="end"
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                  </BarChart>
                                ) : (
                                  <LineChart data={message.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                      dataKey="name"
                                      tick={{ fontSize: 12 }}
                                      interval={0}
                                      angle={-20}
                                      textAnchor="end"
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                      type="monotone"
                                      dataKey="value"
                                      stroke="#8884d8"
                                      strokeWidth={2}
                                    />
                                  </LineChart>
                                )}
                              </ResponsiveContainer>
                            </div>
                          )}
                          {message.explanation && (
                            <div
                              className={cn(
                                "mt-4 p-3 rounded-lg",
                                isDark
                                  ? "bg-[#2D1B69]/30 text-purple-200"
                                  : "bg-purple-50/50 text-gray-900"
                              )}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles
                                  className={cn(
                                    "h-4 w-4",
                                    isDark
                                      ? "text-purple-400"
                                      : "text-purple-600"
                                  )}
                                />
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
        <Card
          className={cn(
            isDark
              ? "bg-[#1A0B2E]/80 border-[#6D28D9]/20"
              : "bg-white border-gray-200"
          )}
        >
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
    <div
      className={cn(
        "p-4 rounded-lg flex items-center gap-3",
        isDark
          ? "bg-[#2D1B69]/50 text-purple-200"
          : "bg-purple-50 text-gray-900"
      )}
    >
      <div className="flex gap-1">
        <div
          className={cn(
            "w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]",
            isDark ? "bg-purple-400" : "bg-purple-600"
          )}
        />
        <div
          className={cn(
            "w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]",
            isDark ? "bg-purple-400" : "bg-purple-600"
          )}
        />
        <div
          className={cn(
            "w-2 h-2 rounded-full animate-bounce",
            isDark ? "bg-purple-400" : "bg-purple-600"
          )}
        />
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
  isDark,
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
      <div
        className={cn(
          "p-1.5 rounded-lg w-fit",
          isDark ? "bg-[#2D1B69]/30" : "bg-purple-100"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4",
            isDark ? "text-purple-400" : "text-purple-600"
          )}
        />
      </div>
      <h3
        className={cn(
          "font-medium text-sm mt-3 mb-1.5",
          isDark ? "text-purple-200" : "text-gray-900"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-xs leading-relaxed line-clamp-3",
          isDark ? "text-purple-300/80" : "text-gray-600"
        )}
      >
        {description}
      </p>
    </button>
  );
}
