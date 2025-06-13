import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export interface NodeStyle {
  text: string;
  bold: boolean;
  italic: boolean;
  glow: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (style: NodeStyle) => void;
}

const AddNodeModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [glow, setGlow] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setText('');
      setBold(false);
      setItalic(false);
      setGlow(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text: text.trim(), bold, italic, glow });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 w-96 max-w-[90vw] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Node
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Node Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter node title..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {/* Style Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Text Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 bg-white/30 hover:bg-white/50 cursor-pointer transition-all duration-200">
                <input
                  type="checkbox"
                  checked={bold}
                  onChange={(e) => setBold(e.target.checked)}
                  className="w-4 h-4 text-violet-600 bg-white border-gray-300 rounded focus:ring-violet-500 focus:ring-2"
                />
                <span className="text-sm font-bold">Bold</span>
              </label>

              <label className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 bg-white/30 hover:bg-white/50 cursor-pointer transition-all duration-200">
                <input
                  type="checkbox"
                  checked={italic}
                  onChange={(e) => setItalic(e.target.checked)}
                  className="w-4 h-4 text-violet-600 bg-white border-gray-300 rounded focus:ring-violet-500 focus:ring-2"
                />
                <span className="text-sm italic">Italic</span>
              </label>

              <label className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 bg-white/30 hover:bg-white/50 cursor-pointer transition-all duration-200">
                <input
                  type="checkbox"
                  checked={glow}
                  onChange={(e) => setGlow(e.target.checked)}
                  className="w-4 h-4 text-violet-600 bg-white border-gray-300 rounded focus:ring-violet-500 focus:ring-2"
                />
                <span className="text-sm bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent font-medium">Glow</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {text && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <span
                className={`text-lg ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''} ${
                  glow 
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent font-semibold' 
                    : 'text-gray-800'
                }`}
              >
                {text}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-violet-500/25"
            >
              Create Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNodeModal;