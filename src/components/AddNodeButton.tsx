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
    className={`fixed right-20 top-1/2 -translate-y-1/2 z-50 ${disabled ? 'opacity-50 cursor-not-allowed' : 'btn-morph'} `}
  >
    <FaPlus />
  </button>
);

export default AddNodeButton;
