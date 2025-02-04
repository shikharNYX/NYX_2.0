import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AlertCircle, CheckCircle2, Loader2, Circle } from 'lucide-react';

interface CustomNodeData {
  label: string;
  status?: 'waiting' | 'running' | 'completed' | 'error';
  type?: 'start' | 'end' | 'process' | 'decision';
}

const CustomNode = ({ data, selected }: NodeProps<CustomNodeData>) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Loader2 className="w-3.5 h-3.5 text-blue-400/70 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-green-400/70" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400/70" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-purple-400/40" />;
    }
  };

  const getNodeStyle = () => {
    const baseStyle = "min-w-[200px] shadow-xl backdrop-blur-sm transition-all duration-300";
    const statusColors = {
      running: "bg-gradient-to-br from-[#2D1B69]/90 to-blue-900/80 border-blue-500/40",
      completed: "bg-gradient-to-br from-[#2D1B69]/90 to-green-900/80 border-green-500/40",
      error: "bg-gradient-to-br from-[#2D1B69]/90 to-red-900/80 border-red-500/40",
      waiting: "bg-gradient-to-br from-[#1A0B2E]/90 to-[#2D1B69]/90 border-[#6D28D9]/40"
    };

    const typeStyles = {
      start: "rounded-full px-6",
      end: "rounded-full px-6",
      process: "rounded-lg",
      decision: "rounded-lg"
    };

    return `${baseStyle} ${statusColors[data.status || 'waiting']} ${typeStyles[data.type || 'process']} ${
      selected ? 'ring-2 ring-[#6D28D9] ring-offset-4 ring-offset-[#110726] scale-105' : ''
    }`;
  };

  const getHandleStyle = (type: 'source' | 'target') => {
    return {
      width: '8px',
      height: '8px',
      background: '#6D28D9',
      border: '2px solid #9F7AEA',
      opacity: selected ? 1 : 0,
      transition: 'all 0.3s ease'
    };
  };

  return (
    <div className={`${getNodeStyle()} p-4 border-2 group hover:scale-105 transition-transform duration-300`}>
      <Handle
        type="target"
        position={Position.Top}
        style={getHandleStyle('target')}
      />
      
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-[#2D1B69]/30 rounded-full border border-[#6D28D9]/20">
          {getStatusIcon()}
        </div>
        <div>
          <div className="text-sm font-medium text-purple-100 group-hover:text-white transition-colors">
            {data.label}
          </div>
          <div className="text-xs text-purple-300/50 mt-0.5">
            {data.type?.charAt(0).toUpperCase() + data.type?.slice(1)}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={getHandleStyle('source')}
      />
    </div>
  );
};

export default memo(CustomNode);
