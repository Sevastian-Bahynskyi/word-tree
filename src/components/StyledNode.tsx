import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

interface Data {
  text: string;
  bold?: boolean;
  italic?: boolean;
  glow?: boolean;
}

const StyledNode: React.FC<NodeProps<Data>> = ({ data, selected }) => {
  return (
    <div
      className={`group rounded-2xl shadow-lg px-6 py-4 bg-white/90 backdrop-blur-sm border-2 transition-all duration-300 hover:shadow-xl min-w-[120px] text-center
              ${selected 
                ? 'border-violet-500 scale-105 shadow-violet-500/20 bg-violet-50/50' 
                : 'border-gray-200 hover:border-violet-300 hover:scale-[1.02]'
              }`}
    >
      <div className="flex items-center justify-center space-x-2">
        <span
          className={`text-lg leading-relaxed ${data.bold ? 'font-bold' : 'font-medium'} ${
            data.italic ? 'italic' : ''
          } ${
            data.glow
              ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold'
              : selected 
                ? 'text-violet-700' 
                : 'text-gray-800'
          } transition-colors duration-200`}
        >
          {data.text}
        </span>
      </div>
      
      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 border-2 border-violet-400 bg-white hover:bg-violet-100 transition-colors duration-200"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 border-2 border-violet-400 bg-white hover:bg-violet-100 transition-colors duration-200"
      />
    </div>
  );
};

export default StyledNode;