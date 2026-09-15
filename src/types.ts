export type QuestionType = 'RIGHT_RESTRICTED' | 'LIMITATION_REASON';

export interface ConstitutionalCase {
  id: number;
  title: string;
  story: string;
  restrictedRight: string;
  limitationReason: string;
}

export interface QuizQuestion {
  id: string;
  caseId: number;
  caseTitle: string;
  caseStory: string;
  questionType: QuestionType;
  questionTitle: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface StudentInfo {
  studentId: string;
  name: string;
}

export type RabbitEvolutionLevel = 1 | 2 | 3 | 4;

export interface RabbitEvolutionInfo {
  level: RabbitEvolutionLevel;
  title: string;
  subtitle: string;
  minPoints: number;
}

export interface GiftItem {
  id: string;
  name: string;
  category: 'persimmon' | 'box';
  icon: string;
  rarity: '일반' | '희귀' | '전설';
  points: number;
  description: string;
}

export interface GameRecord {
  id: string;
  studentId: string;
  name: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  giftsCount: number;
  giftsList: string[];
  timestamp: string;
  syncedToGoogleSheets: boolean;
}

export interface UserAnswerState {
  questionId: string;
  attempts: number;
  isSolved: boolean;
  userChoices: number[];
  failedTwice: boolean;
}
