
export enum GameMode {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MIXED = 'MIXED'
}

export interface Question {
  num1: number;
  num2: number;
  operation: '+' | '-';
  answer: number;
}

export interface GameState {
  score: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  mode: GameMode;
  isCorrect: boolean | null;
  showFeedback: boolean;
}

export type EmojiType = '🍎' | '⭐' | '🦋' | '🎈' | '🍦' | '🚗' | '🐶';
