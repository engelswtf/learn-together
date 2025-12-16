import { GameMode } from "@/types";

export interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  playerCount: "solo" | "multiplayer";
  available: boolean;
}

export const gameModes: GameModeInfo[] = [
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Study at your own pace with flip cards",
    icon: "🃏",
    playerCount: "solo",
    available: true,
  },
  {
    id: "quiz",
    name: "Quiz",
    description: "Test your knowledge with multiple choice",
    icon: "❓",
    playerCount: "solo",
    available: true,
  },
  {
    id: "duel",
    name: "Duel",
    description: "Challenge a friend in turn-based competition",
    icon: "⚔️",
    playerCount: "multiplayer",
    available: true,
  },
  {
    id: "race",
    name: "Race",
    description: "First to answer correctly wins!",
    icon: "🏁",
    playerCount: "multiplayer",
    available: true,
  },
];

export const soloModes = gameModes.filter((mode) => mode.playerCount === "solo");
export const multiplayerModes = gameModes.filter((mode) => mode.playerCount === "multiplayer");
