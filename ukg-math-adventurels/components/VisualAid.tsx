import React from 'react';
import { EmojiType } from '../types.ts';

interface VisualAidProps {
  count: number;
  emoji: EmojiType;
  color: string;
}

const VisualAid: React.FC<VisualAidProps> = ({ count, emoji, color }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`flex flex-wrap justify-center gap-2 p-4 rounded-2xl ${color} bg-opacity-20 border-2 border-dashed border-opacity-40 min-h-[100px] items-center transition-all`}>
      {items.length === 0 ? (
        <span className="text-gray-400 italic">0</span>
      ) : (
        items.map((i) => (
          <span 
            key={i} 
            className="text-4xl md:text-5xl transition-transform hover:scale-110 active:scale-95 cursor-default select-none"
            role="img" 
            aria-label="math-item"
          >
            {emoji}
          </span>
        ))
      )}
    </div>
  );
};

export default VisualAid;