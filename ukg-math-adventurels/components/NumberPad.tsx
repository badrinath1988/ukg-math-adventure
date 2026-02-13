import React from 'react';
import { soundService } from '../services/soundService.ts';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onCheck: () => void;
  currentInput: string;
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onClear, onCheck, currentInput }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const handleNum = (num: number) => {
    soundService.playClick();
    onNumberClick(num);
  };

  const handleClear = () => {
    soundService.playClick();
    onClear();
  };

  const handleCheck = () => {
    onCheck();
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto mt-6">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => handleNum(num)}
          className="bg-white hover:bg-yellow-50 active:bg-yellow-100 text-blue-600 font-bold py-4 rounded-2xl shadow-lg border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 text-2xl transition-all"
        >
          {num}
        </button>
      ))}
      <button
        onClick={handleClear}
        className="bg-red-400 hover:bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-red-600 active:border-b-0 active:translate-y-1 text-xl transition-all"
      >
        ⌫
      </button>
      <button
        onClick={handleCheck}
        disabled={currentInput === ''}
        className={`${currentInput === '' ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-xl transition-all flex items-center justify-center`}
      >
        GO!
      </button>
    </div>
  );
};

export default NumberPad;