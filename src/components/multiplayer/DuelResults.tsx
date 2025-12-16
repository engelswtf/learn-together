"use client";

import { useEffect, useState, useMemo } from "react";
import type { Player, QuizQuestion } from "@/types";

interface AnswerRecord {
  playerId: string;
  questionIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
  timeMs: number;
  points: number;
}

interface DuelResultsProps {
  players: Player[];
  currentPlayerId: string;
  questions: QuizQuestion[];
  answerHistory: AnswerRecord[];
  onRematch: () => void;
  onLeave: () => void;
}

// Player avatar colors
const avatarColors = [
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-blue-500",
];

export function DuelResults({
  players,
  currentPlayerId,
  questions,
  answerHistory,
  onRematch,
  onLeave,
}: DuelResultsProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Sort players by score to determine winner
  const sortedPlayers = useMemo(() => 
    [...players].sort((a, b) => b.score - a.score),
    [players]
  );

  const winner = sortedPlayers[0];
  const isTie = sortedPlayers.length >= 2 && sortedPlayers[0].score === sortedPlayers[1].score;
  const currentPlayerWon = winner?.id === currentPlayerId && !isTie;

  // Hide confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Get answers for a specific question
  const getQuestionAnswers = (questionIndex: number) => {
    return answerHistory.filter((a) => a.questionIndex === questionIndex);
  };

  // Get player name by ID
  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name ?? "Unknown";
  };

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (currentPlayerWon || isTie) && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${
                  ["bg-yellow-400", "bg-pink-400", "bg-blue-400", "bg-green-400", "bg-purple-400"][
                    Math.floor(Math.random() * 5)
                  ]
                }`}
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Results Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
        {/* Header */}
        <div className={`
          py-8 px-6 text-center
          ${isTie 
            ? "bg-gradient-to-r from-gray-500 to-gray-600" 
            : currentPlayerWon 
              ? "bg-gradient-to-r from-amber-400 to-yellow-500" 
              : "bg-gradient-to-r from-indigo-500 to-purple-600"
          }
        `}>
          <div className="text-6xl mb-4">
            {isTie ? "🤝" : currentPlayerWon ? "🏆" : "🎮"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isTie 
              ? "It's a Tie!" 
              : currentPlayerWon 
                ? "You Won!" 
                : `${winner?.name} Wins!`
            }
          </h2>
          <p className="text-white/80">
            {isTie 
              ? "Great match! You're evenly matched." 
              : currentPlayerWon 
                ? "Congratulations on your victory!" 
                : "Better luck next time!"
            }
          </p>
        </div>

        {/* Final Scores */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Final Scores
          </h3>
          <div className="flex justify-center gap-8">
            {sortedPlayers.map((player, index) => {
              const isCurrentPlayer = player.id === currentPlayerId;
              const isWinner = index === 0 && !isTie;

              return (
                <div
                  key={player.id}
                  className={`
                    flex flex-col items-center p-4 rounded-xl transition-all
                    ${isWinner ? "bg-amber-50 dark:bg-amber-900/20" : "bg-gray-50 dark:bg-gray-800/50"}
                  `}
                >
                  {/* Position badge */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2
                    ${index === 0 
                      ? "bg-amber-400 text-amber-900" 
                      : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }
                  `}>
                    {isTie ? "=" : index + 1}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl
                      ${avatarColors[index % avatarColors.length]}
                    `}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <p className={`
                    mt-2 font-medium
                    ${isCurrentPlayer ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}
                  `}>
                    {player.name}
                    {isCurrentPlayer && " (You)"}
                  </p>

                  {/* Score */}
                  <p className={`
                    text-3xl font-bold mt-1
                    ${isWinner ? "text-amber-500" : "text-gray-900 dark:text-white"}
                  `}>
                    {player.score}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Question Breakdown
          </h3>
          <div className="space-y-2">
            {questions.map((question, qIndex) => {
              const answers = getQuestionAnswers(qIndex);
              const isExpanded = expandedQuestion === qIndex;

              return (
                <div
                  key={qIndex}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : qIndex)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        {qIndex + 1}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 text-left line-clamp-1">
                        {question.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Player result indicators */}
                      {players.map((player) => {
                        const answer = answers.find((a) => a.playerId === player.id);
                        return (
                          <div
                            key={player.id}
                            className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs
                              ${answer?.isCorrect 
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              }
                            `}
                            title={`${getPlayerName(player.id)}: ${answer?.isCorrect ? "Correct" : "Wrong"}`}
                          >
                            {answer?.isCorrect ? "✓" : "✗"}
                          </div>
                        );
                      })}
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="font-medium">Correct Answer:</span>{" "}
                        {question.options[question.correctIndex]}
                      </p>
                      <div className="space-y-2">
                        {players.map((player) => {
                          const answer = answers.find((a) => a.playerId === player.id);
                          const isCurrentPlayer = player.id === currentPlayerId;

                          return (
                            <div
                              key={player.id}
                              className={`
                                flex items-center justify-between p-2 rounded-lg
                                ${answer?.isCorrect 
                                  ? "bg-green-50 dark:bg-green-900/20" 
                                  : "bg-red-50 dark:bg-red-900/20"
                                }
                              `}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`
                                  font-medium text-sm
                                  ${isCurrentPlayer ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}
                                `}>
                                  {player.name}
                                </span>
                                {answer && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    answered: {question.options[answer.selectedIndex] ?? "No answer"}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {answer && (
                                  <>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {(answer.timeMs / 1000).toFixed(1)}s
                                    </span>
                                    <span className={`
                                      text-sm font-bold
                                      ${answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
                                    `}>
                                      +{answer.points}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRematch}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rematch
          </button>
          <button
            onClick={onLeave}
            className="py-3 px-8 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Back to Lobby
          </button>
        </div>
      </div>

      {/* Confetti Animation Styles */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}
