import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Library,
  BarChart2,
  Megaphone,
  Lightbulb,
  User,
  CreditCard,
  LogOut,
  ChevronDown,
  Package,
  Users,
  ArrowLeftRight,
  Pencil,
  Workflow,
  Settings,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

// Custom combined icon for AI Workflows
const WorkflowIcon = ({ className }: { className?: string }) => {
  return <Workflow className={className} />;
};

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Megaphone, label: 'Campaigns', path: '/campaigns' },
  { icon: Lightbulb, label: 'AI Insights', path: '/ai-insights' },
  { icon: Bot, label: 'AI Assistant', path: '/ai-assistant' },
  { icon: BrainCircuit, label: 'AI Agents', path: '/ai-agents' },
  { icon: WorkflowIcon, label: 'AI Workflows', path: '/ai-workflows' },
  { icon: Library, label: 'Content Library', path: '/content-library' }
];

export function Sidebar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const username = "Vinay Gupta";
  const email = "vinay@healium.ai";
  const workspaceName = "vingupta3";
  const totalCredits = 20400;
  const usedCredits = 20110;
  const remainingCredits = totalCredits - usedCredits;
  const creditsPercentage = (remainingCredits / totalCredits) * 100;

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className={cn(
      "h-screen w-64 border-r p-4 fixed left-0 top-0 flex flex-col",
      theme === 'dark' 
        ? "bg-[#1A0B2E] border-[#6D28D9]/20" 
        : "bg-white border-gray-200"
    )}>
      {/* Profile Section */}
      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full outline-none">
            <div className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
              theme === 'dark'
                ? "bg-[#2D1B69]/30 hover:bg-[#2D1B69]/50"
                : "bg-gray-100 hover:bg-gray-200"
            )}>
              <Avatar className={cn(
                "h-8 w-8 border",
                theme === 'dark' ? "border-purple-500/20" : "border-gray-300"
              )}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className={cn(
                  theme === 'dark' ? "bg-purple-900/50 text-purple-200" : "bg-gray-200 text-gray-600"
                )}>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <span className={cn(
                  "text-sm font-medium block",
                  theme === 'dark' ? "text-purple-200" : "text-gray-800"
                )}>{username}</span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4",
                theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
              )} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            className={cn(
              "w-72 border",
              theme === 'dark' 
                ? "bg-[#2D1B69] border-purple-500/20 text-purple-200" 
                : "bg-white border-gray-200 text-gray-800"
            )}
            align="start"
            sideOffset={4}
          >
            {/* Profile Info */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className={cn(
                  "h-10 w-10 border",
                  theme === 'dark' ? "border-purple-500/20" : "border-gray-300"
                )}>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className={cn(
                    theme === 'dark' ? "bg-purple-900/50 text-purple-200" : "bg-gray-200 text-gray-600"
                  )}>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm font-medium",
                    theme === 'dark' ? "text-purple-200" : "text-gray-800"
                  )}>{username}</div>
                  <div className={cn(
                    "text-xs",
                    theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
                  )}>{email}</div>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className={cn(
              theme === 'dark' ? "bg-purple-500/20" : "bg-gray-200"
            )} />

            {/* Settings and Plans */}
            <DropdownMenuItem className={cn(
              "px-3 py-2 cursor-pointer",
              theme === 'dark' 
                ? "text-purple-200 hover:bg-purple-500/10" 
                : "text-gray-700 hover:bg-gray-100"
            )}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className={cn(
              "px-3 py-2 cursor-pointer",
              theme === 'dark' 
                ? "text-purple-200 hover:bg-purple-500/10" 
                : "text-gray-700 hover:bg-gray-100"
            )}>
              <Package className="mr-2 h-4 w-4" />
              Plans
            </DropdownMenuItem>
            <DropdownMenuItem className={cn(
              "px-3 py-2 cursor-pointer",
              theme === 'dark' 
                ? "text-purple-200 hover:bg-purple-500/10" 
                : "text-gray-700 hover:bg-gray-100"
            )}>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>

            <DropdownMenuSeparator className={cn(
              theme === 'dark' ? "bg-purple-500/20" : "bg-gray-200"
            )} />

            {/* Theme Toggle */}
            <DropdownMenuItem className={cn(
              "px-3 py-2 cursor-pointer flex justify-between",
              theme === 'dark' 
                ? "text-purple-200 hover:bg-purple-500/10" 
                : "text-gray-700 hover:bg-gray-100"
            )}>
              <div className="flex items-center">
                {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                {theme === 'dark' ? 'Dark' : 'Light'} Mode
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                className={cn(
                  theme === 'dark'
                    ? "bg-purple-900/50 data-[state=checked]:bg-purple-600"
                    : "bg-slate-200 data-[state=checked]:bg-purple-500/80"
                )}
              />
            </DropdownMenuItem>

            <DropdownMenuSeparator className={cn(
              theme === 'dark' ? "bg-purple-500/20" : "bg-gray-200"
            )} />

            {/* Workspace Section */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                  theme === 'dark' 
                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-purple-100 border border-purple-400/20" 
                    : "bg-gradient-to-br from-gray-500 to-gray-600 text-gray-100 border border-gray-400/20"
                )}>
                  VI
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-sm font-medium",
                      theme === 'dark' ? "text-purple-200" : "text-gray-800"
                    )}>{workspaceName}</span>
                    <button className={cn(
                      "transition-colors",
                      theme === 'dark'
                        ? "text-purple-300/70 hover:text-purple-200"
                        : "text-gray-400 hover:text-gray-600"
                    )}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className={cn(
                    "p-1 rounded transition-colors",
                    theme === 'dark'
                      ? "text-purple-300/70 hover:text-purple-200 hover:bg-[#1A0B2E]/50"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  )}>
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                  <button className={cn(
                    "p-1 rounded transition-colors",
                    theme === 'dark'
                      ? "text-purple-300/70 hover:text-purple-200 hover:bg-[#1A0B2E]/50"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  )}>
                    <Users className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className={cn(
              theme === 'dark' ? "bg-purple-500/20" : "bg-gray-200"
            )} />

            {/* Credits Section */}
            <div className="px-3 py-2">
              <div className={cn(
                "text-xs font-medium mb-1",
                theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
              )}>Credits</div>
              <Progress 
                value={creditsPercentage} 
                className={cn(
                  "h-2 mb-1",
                  theme === 'dark' 
                    ? "[&>div]:bg-purple-600" 
                    : "[&>div]:bg-gray-600"
                )} 
              />
              <div className={cn(
                "flex justify-between text-xs",
                theme === 'dark' ? "text-purple-300/70" : "text-gray-500"
              )}>
                <span>{remainingCredits} credits left</span>
                <span>{totalCredits} total</span>
              </div>
            </div>

            {/* Logout */}
            <DropdownMenuItem 
              className={cn(
                "px-3 py-2 cursor-pointer",
                theme === 'dark'
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-red-600 hover:bg-red-50"
              )}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? (theme === 'dark' ? 'bg-[#2D1B69] text-purple-200' : 'bg-gray-100 text-gray-800')
                  : (theme === 'dark' ? 'text-purple-300/80 hover:bg-[#2D1B69]/50 hover:text-purple-200' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800')
              )}
            >
              {typeof item.icon === 'function' ? <item.icon className="h-5 w-5 mr-3" /> : <item.icon className="h-5 w-5 mr-3" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
