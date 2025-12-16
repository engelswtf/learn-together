export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  color: string; // tailwind color class
  cardCount: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface TopicContent {
  topicId: string;
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

export type GameMode = "flashcards" | "quiz" | "duel" | "race";

// Multiplayer Types
export interface Player {
  id: string;
  name: string;
  score: number;
  ready: boolean;
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  topicId: string | null;
  status: "waiting" | "playing" | "finished";
  currentQuestion: number;
  questionCount: number;
}
