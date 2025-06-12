import React, { useState } from 'react';
import EmojiPicker, { type EmojiClickData, EmojiStyle } from 'emoji-picker-react';

export interface NodeStyle {
  text: string;
  emoji?: string;
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
  const [emoji, setEmoji] = useState<string | undefined>(undefined);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [glow, setGlow] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ text, emoji, bold, italic, glow });
    setText('');
    setEmoji(undefined);
    setBold(false);
    setItalic(false);
    setGlow(false);
    setPickerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Create new node</h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Node title"
          className="w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
        />
        <div className="flex space-x-4">
          <label className="flex items-center space-x-1 text-sm">
            <input type="checkbox" checked={bold} onChange={(e) => setBold(e.target.checked)} />
            <span className="font-medium">Bold</span>
          </label>
          <label className="flex items-center space-x-1 text-sm">
            <input type="checkbox" checked={italic} onChange={(e) => setItalic(e.target.checked)} />
            <span className="font-medium">Italic</span>
          </label>
          <label className="flex items-center space-x-1 text-sm">
            <input type="checkbox" checked={glow} onChange={(e) => setGlow(e.target.checked)} />
            <span className="font-medium">Glow</span>
          </label>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Emoji (optional)</p>
          <button
            type="button"
            onClick={() => setPickerOpen((p) => !p)}
            className="px-2 py-1 rounded-md bg-purple-100 hover:bg-purple-200 text-sm"
          >
            {emoji || 'Choose emoji'}
          </button>
          {pickerOpen && (
            <div className="mt-2">
              <EmojiPicker
                emojiStyle={EmojiStyle.NATIVE}
                onEmojiClick={(data: EmojiClickData) => {
                  setEmoji(data.emoji);
                  setPickerOpen(false);
                }}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-md bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 text-white text-sm">Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddNodeModal;
