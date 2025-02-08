import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CheckCircle2, CircleDot, AlertCircle, Clock, X } from 'lucide-react';

interface CustomNodeData {
  label: string;
  status?: 'waiting' | 'running' | 'completed' | 'error';
  type?: 'start' | 'end' | 'process' | 'decision';
  onDelete?: (id: string) => void;
}

const CustomNode = ({ data, id, selected }: NodeProps<CustomNodeData>) => {
  const getStatusColor = () => {
    switch (data.status) {
      case 'completed':
        return 'bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 border-purple-900/50 text-white shadow-lg backdrop-blur-sm';
      case 'running':
        return 'bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 border-purple-500 text-white shadow-lg backdrop-blur-sm relative overflow-hidden ring-2 ring-purple-400/50 ring-offset-2 ring-offset-[#0f172a] after:absolute after:inset-0 after:bg-[length:200%_100%] after:bg-gradient-to-r after:from-transparent after:via-purple-300/10 after:to-transparent after:animate-[wave_3s_linear_infinite] before:absolute before:inset-0 before:rounded-lg before:ring-2 before:ring-purple-500/30 before:animate-[pulse_4s_ease-in-out_infinite]';
      case 'error':
        return 'bg-gradient-to-br from-red-700 via-red-600 to-red-800 border-red-800/50 text-white shadow-lg backdrop-blur-sm';
      default:
        return 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 border-purple-700/50 text-white shadow-lg backdrop-blur-sm';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-white" />;
      case 'running':
        return <CircleDot className="w-4 h-4 text-white" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-white" />;
      default:
        return <Clock className="w-4 h-4 text-white" />;
    }
  };

  const getNodeStyle = () => {
    const baseStyle = 'min-w-[180px] shadow-md border transform-gpu backdrop-filter backdrop-blur-[2px] bg-opacity-95';
    const statusStyle = getStatusColor();
    const typeStyle = data.type === 'start' ? 'rounded-l-2xl rounded-r-lg' :
                     data.type === 'end' ? 'rounded-r-2xl rounded-l-lg' :
                     'rounded-lg';
    const scaleStyle = data.status === 'running' ? 'scale-105' : '';
    const hoverStyle = 'hover:shadow-xl hover:shadow-purple-700/30';
    
    return `${baseStyle} ${statusStyle} ${typeStyle} ${scaleStyle} ${hoverStyle}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}} />
      <div className={`${getNodeStyle()} group relative hover:scale-[1.02] transition-transform duration-200 ease-out will-change-transform`}>
        {/* Delete button */}
        <button
          className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 hover:bg-red-900/80 text-slate-400 hover:text-red-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-slate-700 hover:border-red-700/50 z-10"
          onClick={(e) => {
            e.stopPropagation();
            if (data.onDelete) {
              data.onDelete(id);
            }
          }}
        >
          <X className="w-3 h-3" />
        </button>

        {/* Connection handles */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="w-3 h-3 border-2 border-purple-600 bg-slate-800 hover:border-purple-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          style={{ right: -6 }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="w-3 h-3 border-2 border-purple-600 bg-slate-800 hover:border-purple-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          style={{ bottom: -6 }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="w-3 h-3 border-2 border-purple-600 bg-slate-800 hover:border-purple-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          style={{ left: -6 }}
        />
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="w-3 h-3 border-2 border-purple-600 bg-slate-800 hover:border-purple-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
          style={{ top: -6 }}
        />
        
        {/* Node content */}
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {data.label}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CustomNode);
