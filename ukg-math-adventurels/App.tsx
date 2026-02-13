import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Question, GameState, EmojiType } from './types.ts';
import VisualAid from './components/VisualAid.tsx';
import NumberPad from './components/NumberPad.tsx';
import { getEncouragement, speakText } from './services/geminiService.ts';
import { soundService } from './services/soundService.ts';

const EMOJIS: EmojiType[] = ['🍎', '⭐', '🦋', '🎈', '🍦', '🚗', '🐶'];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    totalQuestions: 0,
    currentQuestion: null,
    mode: GameMode.ADDITION,
    isCorrect: null,
    showFeedback: false,
  });

  const [input, setInput] = useState<string>('');
  const [currentEmoji, setCurrentEmoji] = useState<EmojiType>('🍎');
  const [aiMessage, setAiMessage] = useState<string>("Hi! Let's play math!");
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      soundService.startBackgroundMusic();
      setHasInteracted(true);
    }
  };

  const generateQuestion = useCallback((mode: GameMode): Question => {
    let n1 = Math.floor(Math.random() * 9) + 1;
    let n2 = Math.floor(Math.random() * 9) + 1;
    let op: '+' | '-' = '+';

    if (mode === GameMode.ADDITION) {
      op = '+';
    } else if (mode === GameMode.SUBTRACTION) {
      op = '-';
      if (n1 < n2) [n1, n2] = [n2, n1];
    } else {
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-' && n1 < n2) [n1, n2] = [n2, n1];
    }

    const ans = op === '+' ? n1 + n2 : n1 - n2;
    return { num1: n1, num2: n2, operation: op, answer: ans };
  }, []);

  const startNewQuestion = useCallback((mode: GameMode = gameState.mode) => {
    const q = generateQuestion(mode);
    setGameState(prev => ({
      ...prev,
      currentQuestion: q,
      mode,
      isCorrect: null,
      showFeedback: false
    }));
    setInput('');
    setCurrentEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  }, [gameState.mode, generateQuestion]);

  useEffect(() => {
    startNewQuestion();
  }, [startNewQuestion]);

  const handleNumberClick = (num: number) => {
    handleFirstInteraction();
    if (input.length < 2) {
      setInput(prev => prev + num);
    }
  };

  const handleClear = () => {
    handleFirstInteraction();
    setInput('');
  };

  const handleCheck = async () => {
    handleFirstInteraction();
    if (!gameState.currentQuestion) return;
    
    const userAns = parseInt(input);
    const correct = userAns === gameState.currentQuestion.answer;
    
    if (correct) {
      soundService.playCorrect();
    } else {
      soundService.playWrong();
    }

    setGameState(prev => ({
      ...prev,
      isCorrect: correct,
      showFeedback: true,
      score: correct ? prev.score + 1 : prev.score,
      totalQuestions: prev.totalQuestions + 1
    }));

    const msg = await getEncouragement(gameState.score + (correct ? 1 : 0), correct);
    setAiMessage(msg);
    speakText(msg);

    setTimeout(() => {
      if (correct) {
        startNewQuestion();
      } else {
        setGameState(prev => ({ ...prev, showFeedback: false }));
        setInput('');
      }
    }, 2500);
  };

  const changeMode = (m: GameMode) => {
    handleFirstInteraction();
    soundService.playClick();
    startNewQuestion(m);
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-2xl relative overflow-hidden" onClick={handleFirstInteraction}>
      <div className="bg-yellow-400 p-4 pt-8 flex justify-between items-center rounded-b-3xl shadow-md z-10">
        <div className="flex flex-col">
          <span className="text-white font-black text-2xl drop-shadow-sm uppercase tracking-wider">Math Fun</span>
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xl ${i < (gameState.score % 5) ? 'opacity-100' : 'opacity-30'}`}>⭐</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-full px-4 py-1 text-yellow-600 font-bold shadow-inner">
          Score: {gameState.score}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4 px-4">
        {Object.values(GameMode).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
              gameState.mode === m 
                ? 'bg-blue-500 text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-between">
        {gameState.currentQuestion && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-2xl relative mb-6">
              <div className="absolute -top-3 left-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-blue-50"></div>
              <p className="text-blue-700 font-medium text-center text-sm md:text-base">
                {aiMessage}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-6xl font-black text-gray-800 my-4">
              <div className="flex flex-col items-center">
                <span className="mb-2 text-7xl text-blue-600">{gameState.currentQuestion.num1}</span>
                <VisualAid count={gameState.currentQuestion.num1} emoji={currentEmoji} color="bg-blue-500" />
              </div>
              <span className="text-4xl text-gray-400 self-start mt-4">{gameState.currentQuestion.operation}</span>
              <div className="flex flex-col items-center">
                <span className="mb-2 text-7xl text-red-500">{gameState.currentQuestion.num2}</span>
                <VisualAid 
                   count={gameState.currentQuestion.num2} 
                   emoji={currentEmoji} 
                   color={gameState.currentQuestion.operation === '+' ? 'bg-red-500' : 'bg-orange-500'} 
                />
              </div>
            </div>

            <div className="flex flex-col items-center mt-6">
              <div className="text-2xl text-gray-400 font-bold mb-2">HOW MANY?</div>
              <div className="w-32 h-20 bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-5xl font-black text-green-600 shadow-inner">
                {input || '?'}
              </div>
            </div>
          </div>
        )}
      </div>

      {gameState.showFeedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 transition-all duration-300">
          <div className="text-center p-8 rounded-3xl bouncy">
            {gameState.isCorrect ? (
              <>
                <div className="text-9xl mb-4">🥳</div>
                <h2 className="text-4xl font-black text-green-500">CORRECT!</h2>
                <p className="text-xl text-gray-600 mt-2">You are a superstar!</p>
              </>
            ) : (
              <>
                <div className="text-9xl mb-4">🤔</div>
                <h2 className="text-4xl font-black text-orange-500">TRY AGAIN</h2>
                <p className="text-xl text-gray-600 mt-2">Count them slowly!</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-t-[3rem] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <NumberPad 
          onNumberClick={handleNumberClick}
          onClear={handleClear}
          onCheck={handleCheck}
          currentInput={input}
        />
      </div>
    </div>
  );
};

export default App;