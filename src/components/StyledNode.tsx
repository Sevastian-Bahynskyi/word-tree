import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

interface Data {
  text: string;
  emoji?: string;
  bold?: boolean;
  italic?: boolean;
  glow?: boolean;
}

const StyledNode: React.FC<NodeProps<Data>> = ({ data, selected }) => {
  return (
    <div
      className={`group rounded-lg shadow-lg px-4 py-2 bg-white border-2 transition-all duration-200
              ${selected ? 'border-blue-500 scale-105 shadow-2xl' : 'border-gray-300'} `}
    >
      {data.emoji && <img src={data.emoji} alt="emoji" className="w-5 h-5" />}
      <span
        className={`${data.bold ? 'font-bold' : ''} ${data.italic ? 'italic' : ''} ${data.glow ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 drop-shadow' : ''
          }`}
      >
        {data.text}
      </span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default StyledNode;
