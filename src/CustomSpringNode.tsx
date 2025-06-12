import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { motion } from 'framer-motion';

const CustomSpringNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <motion.div
      initial={{ x: data.position?.x || 0, y: data.position?.y || 0 }}
      animate={{ x: data.home?.x || 0, y: data.home?.y || 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`rounded-lg shadow-lg px-6 py-3 bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} text-lg font-semibold flex items-center justify-center`}
      style={{ position: 'absolute' }}
    >
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default CustomSpringNode; 