"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Socket } from "socket.io-client";
import { DuelScoreboard } from "./DuelScoreboard";
import { DuelResults } from "./DuelResults";
import type { Room, Player, QuizQuestion } from "@/types";

interface RaceGameProps {
  questions: QuizQuestion[];
  room: Room;
  socket: Socket;
  playerId: string;
  onLeave: () => void;
  onRematch: () => void;
}

interface AnswerRecord {
  playerId: string;
  questionIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
  timeMs: number;
  points: number;
}

// Track wrong answers by player
interface WrongAnswer {
  playerId: string;
  playerName: string;
  selectedIndex: number;
}

const NEXT_QUESTION_DELAY = 3;
const optionLabels = ["A", "B", "C", "D"];

export function RaceGame({ questions, room: initialRoom, socket, playerId, onLeave, onRematch }: RaceGameProps) {
  // Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>(initialRoom.players);
  const [gamePhase, setGamePhase] = useState<"racing" | "winner" | "no-winner" | "finished">("racing");
  
  // Track ALL wrong answers (from all players)
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  // Track if current player has failed this round
  const [hasFailed, setHasFailed] = useState(false);
  // Track pending answer (for loading state)
  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);
  
  const [roundWinner, setRoundWinner] = useState<{
    winnerId: string;
    winnerName: string;
    correctIndex: number;
    points: number;
    timeMs: number;
  } | null>(null);
  
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  
  // Use ref to prevent double-clicks
  const isSubmittingRef = useRef(false);
  
  // Answer history for results
  const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([]);
  
  // Timing
  const questionStartTime = useRef<number>(Date.now());
  const nextQuestionTimer = useRef<NodeJS.Timeout | null>(null);

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isHost = initialRoom.hostId === playerId;

  // Create a map of wrong answers by index for quick lookup
  const wrongAnswersByIndex = useMemo(() => {
    const map = new Map<number, WrongAnswer>();
    wrongAnswers.forEach(wa => {
      map.set(wa.selectedIndex, wa);
    });
    return map;
  }, [wrongAnswers]);

  // Submit answer
  const submitAnswer = useCallback((index: number) => {
    // Block if already submitting, already failed, or not racing
    if (isSubmittingRef.current) return;
    if (hasFailed) return;
    if (gamePhase !== "racing") return;
    if (wrongAnswersByIndex.has(index)) return; // Someone already picked this wrong answer

    isSubmittingRef.current = true;
    
    const timeMs = Date.now() - questionStartTime.current;
    setPendingAnswer(index);

    socket.emit("race-answer", {
      code: initialRoom.code,
      questionIndex: currentQuestionIndex,
      selectedIndex: index,
      correctIndex: currentQuestion.correctIndex,
      timeMs,
    });
  }, [gamePhase, hasFailed, wrongAnswersByIndex, socket, initialRoom.code, currentQuestionIndex, currentQuestion.correctIndex]);

  // Socket event handlers
  useEffect(() => {
    // Wrong answer from ANY player
    const handleWrongAnswer = (data: { 
      playerId: string; 
      playerName: string;
      questionIndex: number; 
      selectedIndex: number;
    }) => {
      if (data.questionIndex === currentQuestionIndex) {
        // Add to wrong answers list
        setWrongAnswers(prev => [...prev, {
          playerId: data.playerId,
          playerName: data.playerName,
          selectedIndex: data.selectedIndex,
        }]);
        
        // If it's MY wrong answer, lock me out
        if (data.playerId === playerId) {
          setHasFailed(true);
          setPendingAnswer(null);
        }
        
        isSubmittingRef.current = false;
      }
    };

    // Someone won the round
    const handleRoundWinner = (data: {
      winnerId: string;
      winnerName: string;
      questionIndex: number;
      correctIndex: number;
      selectedIndex: number;
      timeMs: number;
      points: number;
      players: Player[];
    }) => {
      setPlayers(data.players);
      setRoundWinner({
        winnerId: data.winnerId,
        winnerName: data.winnerName,
        correctIndex: data.correctIndex,
        points: data.points,
        timeMs: data.timeMs,
      });
      setCorrectIndex(data.correctIndex);
      setGamePhase("winner");
      setPendingAnswer(null);
      isSubmittingRef.current = false;

      // Add to history
      setAnswerHistory(prev => [
        ...prev,
        {
          playerId: data.winnerId,
          questionIndex: data.questionIndex,
          selectedIndex: data.selectedIndex,
          isCorrect: true,
          timeMs: data.timeMs,
          points: data.points,
        },
      ]);

      // Auto advance after delay (host triggers)
      if (isHost) {
        nextQuestionTimer.current = setTimeout(() => {
          socket.emit("race-next-question", { code: initialRoom.code });
        }, NEXT_QUESTION_DELAY * 1000);
      }
    };

    // No winner (everyone failed)
    const handleNoWinner = (data: { questionIndex: number; correctIndex: number }) => {
      setCorrectIndex(data.correctIndex);
      setGamePhase("no-winner");
      setPendingAnswer(null);
      isSubmittingRef.current = false;

      // Auto advance after delay (host triggers)
      if (isHost) {
        nextQuestionTimer.current = setTimeout(() => {
          socket.emit("race-next-question", { code: initialRoom.code });
        }, NEXT_QUESTION_DELAY * 1000);
      }
    };

    // Next question starting
    const handleQuestionStart = (data: { questionIndex: number }) => {
      setCurrentQuestionIndex(data.questionIndex);
      setWrongAnswers([]);
      setHasFailed(false);
      setPendingAnswer(null);
      setRoundWinner(null);
      setCorrectIndex(null);
      setGamePhase("racing");
      isSubmittingRef.current = false;
      questionStartTime.current = Date.now();
    };

    // Game over
    const handleGameOver = (data: { players: Player[] }) => {
      setPlayers(data.players);
      setGamePhase("finished");
      isSubmittingRef.current = false;
    };

    socket.on("race-wrong-answer", handleWrongAnswer);
    socket.on("race-round-winner", handleRoundWinner);
    socket.on("race-round-no-winner", handleNoWinner);
    socket.on("race-question-start", handleQuestionStart);
    socket.on("race-game-over", handleGameOver);

    return () => {
      socket.off("race-wrong-answer", handleWrongAnswer);
      socket.off("race-round-winner", handleRoundWinner);
      socket.off("race-round-no-winner", handleNoWinner);
      socket.off("race-question-start", handleQuestionStart);
      socket.off("race-game-over", handleGameOver);

      if (nextQuestionTimer.current) clearTimeout(nextQuestionTimer.current);
    };
  }, [socket, currentQuestionIndex, isHost, initialRoom.code, playerId]);

  // Get option styles
  const getOptionStyles = useCallback((index: number) => {
    const baseStyles = "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4 border-2";
    const wrongPlayer = wrongAnswersByIndex.get(index);
    const isWrongAnswer = wrongPlayer !== undefined;

    // Winner or no-winner phase - show correct answer
    if ((gamePhase === "winner" || gamePhase === "no-winner") && correctIndex !== null) {
      if (index === correctIndex) {
        return `${baseStyles} bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200`;
      }
      if (isWrongAnswer) {
        return `${baseStyles} bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200 opacity-75`;
      }
      return `${baseStyles} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 opacity-60`;
    }

    // Someone picked this as wrong answer
    if (isWrongAnswer) {
      return `${baseStyles} bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 cursor-not-allowed`;
    }

    // I'm waiting for my answer to be checked
    if (pendingAnswer === index) {
      return `${baseStyles} bg-indigo-100 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 cursor-wait animate-pulse`;
    }

    // I already failed - all remaining options disabled
    if (hasFailed) {
      return `${baseStyles} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60`;
    }

    // I'm waiting for server response
    if (pendingAnswer !== null) {
      return `${baseStyles} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60`;
    }

    // Available to click
    return `${baseStyles} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer`;
  }, [gamePhase, correctIndex, wrongAnswersByIndex, pendingAnswer, hasFailed]);

  // Get label styles
  const getLabelStyles = useCallback((index: number) => {
    const baseStyles = "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0";
    const isWrongAnswer = wrongAnswersByIndex.has(index);

    if ((gamePhase === "winner" || gamePhase === "no-winner") && correctIndex === index) {
      return `${baseStyles} bg-emerald-500 text-white`;
    }
    if (isWrongAnswer) {
      return `${baseStyles} bg-red-500 text-white`;
    }
    if (pendingAnswer === index) {
      return `${baseStyles} bg-indigo-500 text-white`;
    }
    return `${baseStyles} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300`;
  }, [gamePhase, correctIndex, wrongAnswersByIndex, pendingAnswer]);

  // Check if button should be disabled
  const isButtonDisabled = useCallback((index: number) => {
    if (gamePhase !== "racing") return true;
    if (hasFailed) return true;
    if (pendingAnswer !== null) return true;
    if (wrongAnswersByIndex.has(index)) return true;
    return false;
  }, [gamePhase, hasFailed, pendingAnswer, wrongAnswersByIndex]);

  // Finished - show results
  if (gamePhase === "finished") {
    return (
      <DuelResults
        players={players}
        currentPlayerId={playerId}
        questions={questions}
        answerHistory={answerHistory}
        onRematch={onRematch}
        onLeave={onLeave}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <DuelScoreboard players={players} currentPlayerId={playerId} />

      {/* Progress */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏁</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Race Mode</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Question</span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {currentQuestionIndex + 1}
          </span>
          <span className="text-sm text-gray-400">/ {totalQuestions}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          First correct answer wins!
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
        {currentQuestion.options.map((option, index) => {
          const wrongPlayer = wrongAnswersByIndex.get(index);
          
          return (
            <div
              key={index}
              onClick={() => !isButtonDisabled(index) && submitAnswer(index)}
              role="button"
              tabIndex={isButtonDisabled(index) ? -1 : 0}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isButtonDisabled(index)) {
                  e.preventDefault();
                  submitAnswer(index);
                }
              }}
              aria-disabled={isButtonDisabled(index)}
              className={getOptionStyles(index)}
            >
              <span className={getLabelStyles(index)}>
                {optionLabels[index]}
              </span>
              <span className="flex-1 text-base md:text-lg font-medium">{option}</span>
              
              {/* Show who picked this wrong answer */}
              {wrongPlayer && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {wrongPlayer.playerId === playerId ? "You" : wrongPlayer.playerName}
                  </span>
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              
              {/* Loading spinner for pending answer */}
              {pendingAnswer === index && (
                <svg className="w-6 h-6 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              
              {/* Correct answer checkmark */}
              {(gamePhase === "winner" || gamePhase === "no-winner") && correctIndex === index && (
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Status messages */}
      {pendingAnswer !== null && gamePhase === "racing" && (
        <div className="text-center text-indigo-500 dark:text-indigo-400 animate-pulse font-medium">
          Checking answer...
        </div>
      )}

      {hasFailed && gamePhase === "racing" && (
        <div className="text-center text-red-500 dark:text-red-400 font-medium">
          ❌ Wrong answer! Waiting for other players...
        </div>
      )}

      {/* Winner Announcement */}
      {gamePhase === "winner" && roundWinner && (
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-2xl p-6 border border-amber-300 dark:border-amber-700 text-center">
          <span className="text-4xl mb-2 block">🏆</span>
          <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-1">
            {roundWinner.winnerId === playerId ? "You won this round!" : `${roundWinner.winnerName} wins!`}
          </h3>
          <p className="text-amber-700 dark:text-amber-300">
            +{roundWinner.points} points in {(roundWinner.timeMs / 1000).toFixed(2)}s
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Next question in {NEXT_QUESTION_DELAY} seconds...
          </p>
        </div>
      )}

      {/* No Winner Announcement */}
      {gamePhase === "no-winner" && (
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-gray-300 dark:border-gray-600 text-center">
          <span className="text-4xl mb-2 block">😅</span>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-1">
            No winner this round!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Everyone got it wrong
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Next question in {NEXT_QUESTION_DELAY} seconds...
          </p>
        </div>
      )}
    </div>
  );
}
