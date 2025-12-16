"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/types";

interface DuelScoreboardProps {
  players: Player[];
  currentPlayerId: string;
}

// Player avatar colors
const avatarColors = [
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
];

export function DuelScoreboard({ players, currentPlayerId }: DuelScoreboardProps) {
  const [animatingScores, setAnimatingScores] = useState<Record<string, boolean>>({});
  const [prevScores, setPrevScores] = useState<Record<string, number>>({});

  // Detect score changes and trigger animations
  useEffect(() => {
    const newAnimating: Record<string, boolean> = {};
    
    players.forEach((player) => {
      if (prevScores[player.id] !== undefined && prevScores[player.id] !== player.score) {
        newAnimating[player.id] = true;
      }
    });

    if (Object.keys(newAnimating).length > 0) {
      setAnimatingScores(newAnimating);
      
      // Clear animation after 500ms
      const timer = setTimeout(() => {
        setAnimatingScores({});
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [players, prevScores]);

  // Update previous scores after render
  useEffect(() => {
    const scores: Record<string, number> = {};
    players.forEach((player) => {
      scores[player.id] = player.score;
    });
    setPrevScores(scores);
  }, [players]);

  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const leadingScore = sortedPlayers[0]?.score ?? 0;
  const isTied = sortedPlayers.length >= 2 && sortedPlayers[0].score === sortedPlayers[1].score;

  // Render player card
  const renderPlayerCard = (player: Player, index: number) => {
    const isCurrentPlayer = player.id === currentPlayerId;
    const isLeading = player.score === leadingScore && player.score > 0 && !isTied;
    const isAnimating = animatingScores[player.id];

    return (
      <div
        key={player.id}
        className={`
          relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 flex-1 min-w-0
          ${isCurrentPlayer 
            ? "bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-600" 
            : "bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent"
          }
          ${isLeading ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-gray-900" : ""}
        `}
      >
        {/* Leading indicator */}
        {isLeading && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="text-xl">👑</span>
          </div>
        )}

        {/* Avatar */}
        <div
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl
            ${avatarColors[index % avatarColors.length]}
            ${isAnimating ? "animate-bounce" : ""}
          `}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <p className={`
          mt-2 font-medium text-sm md:text-base truncate max-w-[80px] md:max-w-[120px]
          ${isCurrentPlayer 
            ? "text-indigo-700 dark:text-indigo-300" 
            : "text-gray-700 dark:text-gray-300"
          }
        `}>
          {player.name}
          {isCurrentPlayer && " (You)"}
        </p>

        {/* Score */}
        <div className={`
          mt-1 text-2xl md:text-3xl font-bold transition-all duration-300
          ${isAnimating ? "scale-125 text-green-500" : ""}
          ${isLeading 
            ? "text-amber-500" 
            : isCurrentPlayer 
              ? "text-indigo-600 dark:text-indigo-400" 
              : "text-gray-900 dark:text-white"
          }
        `}>
          {player.score}
        </div>

        {/* Points label */}
        <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
      </div>
    );
  };

  // VS badge component
  const VsBadge = () => (
    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-md">
      <span className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400">VS</span>
    </div>
  );

  // For 2 players, show: Player1 - VS - Player2 (inline)
  if (players.length === 2) {
    return (
      <div className="flex items-center justify-center gap-3 md:gap-6">
        {renderPlayerCard(players[0], 0)}
        <VsBadge />
        {renderPlayerCard(players[1], 1)}
      </div>
    );
  }

  // For 3+ players, show grid without VS
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {players.map((player, index) => renderPlayerCard(player, index))}
    </div>
  );
}
