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
import { useState } from 'react';

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
    <div className="h-screen w-64 bg-[#1A0B2E] border-r border-[#6D28D9]/20 p-4 fixed left-0 top-0 flex flex-col">
      {/* Profile Section */}
      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full outline-none">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#2D1B69]/30 hover:bg-[#2D1B69]/50 transition-colors">
              <Avatar className="h-8 w-8 border border-purple-500/20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-purple-900/50 text-purple-200">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-purple-200 block">{username}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-purple-300/70" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            className="w-72 bg-[#2D1B69] border-purple-500/20 text-purple-200" 
            align="start"
            sideOffset={4}
          >
            {/* Profile Info */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-10 w-10 border border-purple-500/20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-purple-900/50 text-purple-200">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium text-purple-200">{username}</div>
                  <div className="text-xs text-purple-300/70">{email}</div>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-[#6D28D9]/20" />
            
            {/* Menu Items */}
            <DropdownMenuItem className="hover:bg-[#1A0B2E]/50 focus:bg-[#1A0B2E]/50 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1A0B2E]/50 focus:bg-[#1A0B2E]/50 cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              <span>Plans</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1A0B2E]/50 focus:bg-[#1A0B2E]/50 cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[#6D28D9]/20" />
            
            {/* Workspace Section */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-purple-100 font-medium border border-purple-400/20">
                  VI
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-purple-200">{workspaceName}</span>
                    <button className="text-purple-300/70 hover:text-purple-200 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-[#1A0B2E]/50 rounded text-purple-300/70 hover:text-purple-200 transition-colors">
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                  <button className="p-1 hover:bg-[#1A0B2E]/50 rounded text-purple-300/70 hover:text-purple-200 transition-colors">
                    <Users className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="relative pt-2">
                <div className="h-1 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                    style={{ width: `${(usedCredits / totalCredits) * 100}%` }}
                  />
                </div>
                <div className="mt-1.5 text-xs text-purple-300/70">
                  <span>Owner credits: {usedCredits}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenuSeparator className="bg-[#6D28D9]/20" />
            
            {/* Logout */}
            <DropdownMenuItem 
              className="hover:bg-red-900/20 focus:bg-red-900/20 cursor-pointer text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
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
                  ? 'bg-[#2D1B69] text-purple-200'
                  : 'text-purple-300/80 hover:bg-[#2D1B69]/50 hover:text-purple-200'
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
