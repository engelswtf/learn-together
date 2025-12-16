"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import { DuelScoreboard } from "./DuelScoreboard";
import { DuelResults } from "./DuelResults";
import type { Room, Player, QuizQuestion } from "@/types";

interface AnswerRecord {
  playerId: string;
  questionIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
  timeMs: number;
  points: number;
}

interface RoundResult {
  questionIndex: number;
  correctIndex: number;
  playerAnswers: {
    playerId: string;
    selectedIndex: number;
    isCorrect: boolean;
    timeMs: number;
    points: number;
  }[];
}

interface DuelGameProps {
  questions: QuizQuestion[];
  room: Room;
  socket: Socket;
  playerId: string;
  onLeave: () => void;
  onRematch: () => void;
}

const QUESTION_TIME_SECONDS = 10;
const RESULT_DISPLAY_SECONDS = 3;
const optionLabels = ["A", "B", "C", "D"];

export function DuelGame({ questions, room: initialRoom, socket, playerId, onLeave, onRematch }: DuelGameProps) {
  // Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>(initialRoom.players);
  const [gamePhase, setGamePhase] = useState<"answering" | "results" | "finished">("answering");
  
  // Question state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);
  
  // Results state
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([]);
  
  // Timing
  const questionStartTime = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resultTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Calculate points based on time taken
  const calculatePoints = useCallback((timeMs: number, isCorrect: boolean): number => {
    if (!isCorrect) return 0;
    const basePoints = 100;
    const maxBonus = 50;
    const maxTimeMs = QUESTION_TIME_SECONDS * 1000;
    const speedBonus = Math.round((1 - timeMs / maxTimeMs) * maxBonus);
    return basePoints + Math.max(0, speedBonus);
  }, []);

  // Submit answer
  const submitAnswer = useCallback((index: number) => {
    if (hasSubmitted || gamePhase !== "answering") return;

    const timeMs = Date.now() - questionStartTime.current;
    const isCorrect = index === currentQuestion.correctIndex;
    const points = calculatePoints(timeMs, isCorrect);

    setSelectedIndex(index);
    setHasSubmitted(true);

    // Emit to server
    socket.emit("submit-answer", {
      code: initialRoom.code,
      questionIndex: currentQuestionIndex,
      selectedIndex: index,
      timeMs,
        correctIndex: currentQuestion.correctIndex,
      isCorrect,
      points,
    });
  }, [hasSubmitted, gamePhase, currentQuestion, calculatePoints, socket, initialRoom.code, currentQuestionIndex]);

  // Handle timeout - auto submit with no answer
  const handleTimeout = useCallback(() => {
    if (!hasSubmitted && gamePhase === "answering") {
      const timeMs = QUESTION_TIME_SECONDS * 1000;
      
      setHasSubmitted(true);

      socket.emit("submit-answer", {
        code: initialRoom.code,
        questionIndex: currentQuestionIndex,
        selectedIndex: -1, // No answer
        timeMs,
        correctIndex: currentQuestion.correctIndex,
        isCorrect: false,
        points: 0,
      });
    }
  }, [hasSubmitted, gamePhase, currentQuestion, socket, initialRoom.code, currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    if (gamePhase !== "answering") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gamePhase, handleTimeout]);

  // Socket event handlers
  useEffect(() => {
    // Opponent submitted their answer
    const handleAnswerSubmitted = (data: { playerId: string }) => {
      if (data.playerId !== playerId) {
        setOpponentSubmitted(true);
      }
    };

    // Round results received
    const handleRoundResults = (data: { result: RoundResult; players: Player[] }) => {
      setRoundResult(data.result);
      setPlayers(data.players);
      setGamePhase("results");

      // Add to answer history
      const newRecords: AnswerRecord[] = data.result.playerAnswers.map((pa) => ({
        playerId: pa.playerId,
        questionIndex: data.result.questionIndex,
        selectedIndex: pa.selectedIndex,
        isCorrect: pa.isCorrect,
        timeMs: pa.timeMs,
        points: pa.points,
      }));
      setAnswerHistory((prev) => [...prev, ...newRecords]);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Auto advance after delay
      resultTimerRef.current = setTimeout(() => {
        if (data.result.questionIndex < totalQuestions - 1) {
          // Move to next question
          setCurrentQuestionIndex(data.result.questionIndex + 1);
          setSelectedIndex(null);
          setHasSubmitted(false);
          setOpponentSubmitted(false);
          setTimeLeft(QUESTION_TIME_SECONDS);
          setRoundResult(null);
          setGamePhase("answering");
          questionStartTime.current = Date.now();
        } else {
          // Game over
          setGamePhase("finished");
        }
      }, RESULT_DISPLAY_SECONDS * 1000);
    };

    // Game over
    const handleGameOver = (data: { players: Player[] }) => {
      setPlayers(data.players);
      setGamePhase("finished");
    };

    // Player disconnected
    const handlePlayerDisconnected = (data: { playerId: string }) => {
      if (data.playerId !== playerId) {
        // Opponent left - they forfeit
        setGamePhase("finished");
      }
    };

    socket.on("answer-submitted", handleAnswerSubmitted);
    socket.on("round-results", handleRoundResults);
    socket.on("game-over", handleGameOver);
    socket.on("player-disconnected", handlePlayerDisconnected);

    return () => {
      socket.off("answer-submitted", handleAnswerSubmitted);
      socket.off("round-results", handleRoundResults);
      socket.off("game-over", handleGameOver);
      socket.off("player-disconnected", handlePlayerDisconnected);

      if (timerRef.current) clearInterval(timerRef.current);
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [socket, playerId, totalQuestions]);

  // Handle rematch
  const handleRematch = useCallback(() => {
    socket.emit("request-rematch", { code: initialRoom.code });
    onRematch();
  }, [socket, initialRoom.code, onRematch]);

  // Get option styles
  const getOptionStyles = useCallback((index: number) => {
    const baseStyles = "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4 border-2";

    if (gamePhase === "results" && roundResult) {
      const correctIndex = roundResult.correctIndex;
      if (index === correctIndex) {
        return `${baseStyles} bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200`;
      }
      if (index === selectedIndex && index !== correctIndex) {
        return `${baseStyles} bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200`;
      }
      return `${baseStyles} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 opacity-60`;
    }

    if (index === selectedIndex) {
      return `${baseStyles} bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 text-indigo-800 dark:text-indigo-200`;
    }

    if (hasSubmitted) {
      return `${baseStyles} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed`;
    }

    return `${baseStyles} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer`;
  }, [gamePhase, roundResult, selectedIndex, hasSubmitted]);

  // Get label styles
  const getLabelStyles = useCallback((index: number) => {
    const baseStyles = "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0";

    if (gamePhase === "results" && roundResult) {
      if (index === roundResult.correctIndex) {
        return `${baseStyles} bg-emerald-500 text-white`;
      }
      if (index === selectedIndex && index !== roundResult.correctIndex) {
        return `${baseStyles} bg-red-500 text-white`;
      }
      return `${baseStyles} bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400`;
    }

    if (index === selectedIndex) {
      return `${baseStyles} bg-indigo-500 text-white`;
    }

    return `${baseStyles} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300`;
  }, [gamePhase, roundResult, selectedIndex]);

  // Show finished state
  if (gamePhase === "finished") {
    return (
      <DuelResults
        players={players}
        currentPlayerId={playerId}
        questions={questions}
        answerHistory={answerHistory}
        onRematch={handleRematch}
        onLeave={onLeave}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <div className="relative">
        <DuelScoreboard players={players} currentPlayerId={playerId} />
      </div>

      {/* Progress & Timer */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        {/* Question Progress */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question
          </span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {currentQuestionIndex + 1}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            / {totalQuestions}
          </span>
        </div>

        {/* Timer */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          ${timeLeft <= 3 
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }
          ${timeLeft <= 3 ? "animate-pulse" : ""}
        `}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xl font-bold tabular-nums">{timeLeft}s</span>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-3">
          {hasSubmitted && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              ✓ You answered
            </span>
          )}
          {opponentSubmitted && (
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              ✓ Opponent answered
            </span>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white text-center">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !hasSubmitted && gamePhase === "answering" && submitAnswer(index)}
            disabled={hasSubmitted || gamePhase !== "answering"}
            className={getOptionStyles(index)}
          >
            <span className={getLabelStyles(index)}>
              {optionLabels[index]}
            </span>
            <span className="flex-1 text-base md:text-lg font-medium">
              {option}
            </span>
            {/* Result icons */}
            {gamePhase === "results" && roundResult && (
              <>
                {index === roundResult.correctIndex && (
                  <svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {index === selectedIndex && index !== roundResult.correctIndex && (
                  <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Round Results Overlay */}
      {gamePhase === "results" && roundResult && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Round Results
          </h3>
          <div className="space-y-3">
            {roundResult.playerAnswers.map((pa) => {
              const player = players.find((p) => p.id === pa.playerId);
              const isCurrentPlayer = pa.playerId === playerId;

              return (
                <div
                  key={pa.playerId}
                  className={`
                    flex items-center justify-between p-3 rounded-xl
                    ${pa.isCorrect 
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                      ${pa.isCorrect ? "bg-green-500" : "bg-red-500"}
                    `}>
                      {pa.isCorrect ? "✓" : "✗"}
                    </span>
                    <span className={`
                      font-medium
                      ${isCurrentPlayer ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}
                    `}>
                      {player?.name ?? "Unknown"}
                      {isCurrentPlayer && " (You)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {(pa.timeMs / 1000).toFixed(1)}s
                    </span>
                    <span className={`
                      text-lg font-bold
                      ${pa.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
                    `}>
                      +{pa.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Next question in {RESULT_DISPLAY_SECONDS} seconds...
          </p>
        </div>
      )}
    </div>
  );
}
