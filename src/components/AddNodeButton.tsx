import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const AddNodeButton: React.FC<Props> = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={disabled ? 'Select a node to add' : 'Add node'}
    className={`fixed right-20 top-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 text-white rounded-full w-32 h-32 flex items-center justify-center text-6xl shadow-xl transition-all duration-300 z-50 button-glow ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:animate-morph hover:scale-110 active:scale-90'}`}
  >
    <FaPlus />
  </button>
);

export default AddNodeButton;
