"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { topicContent } from "@/data/content";
import { Lobby } from "@/components/multiplayer/Lobby";
import { WaitingRoom } from "@/components/multiplayer/WaitingRoom";
import { DuelGame } from "@/components/multiplayer/DuelGame";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { usePlayer } from "@/contexts/PlayerContext";
import { useProgress } from "@/hooks/useProgress";
import type { Room, QuizQuestion } from "@/types";

type GameState = "lobby" | "waiting" | "playing" | "finished";

// Default topic - host can change in waiting room
const DEFAULT_TOPIC = "math";

export default function PlayDuelPage() {
  const router = useRouter();
  const { playerName, isLoggedIn } = usePlayer();
  const { recordDuelGame } = useProgress();

  const [gameState, setGameState] = useState<GameState>("lobby");
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentTopicId, setCurrentTopicId] = useState<string>(DEFAULT_TOPIC);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  // Listen for rematch-started event
  useEffect(() => {
    const socket = getSocket();
    const handleRematchStarted = (data: { room: Room }) => {
      setRoom(data.room);
      setQuestions([]);
      setGameState("waiting");
    };
    socket.on("rematch-started", handleRematchStarted);
    return () => {
      socket.off("rematch-started", handleRematchStarted);
    };
  }, []);

  // Listen for topic changes from waiting room
  useEffect(() => {
    const socket = getSocket();
    const handleTopicSelected = (data: { topicId: string }) => {
      setCurrentTopicId(data.topicId);
    };
    socket.on("topic-selected", handleTopicSelected);
    return () => {
      socket.off("topic-selected", handleTopicSelected);
    };
  }, []);

  // Listen for game-over to record stats
  useEffect(() => {
    const socket = getSocket();
    const handleGameOver = (data: { players: Array<{ id: string; name: string; score: number }> }) => {
      if (!playerId) return;
      
      // Find if current player won
      const sortedPlayers = [...data.players].sort((a, b) => b.score - a.score);
      const won = sortedPlayers[0]?.id === playerId;
      recordDuelGame(won);
    };
    socket.on("game-over", handleGameOver);
    return () => {
      socket.off("game-over", handleGameOver);
    };
  }, [playerId, recordDuelGame]);

  // Handle room joined from lobby
  const handleRoomJoined = useCallback(
    (joinedRoom: Room, joinedPlayerId: string, hostStatus: boolean) => {
      setRoom(joinedRoom);
      setPlayerId(joinedPlayerId);
      setIsHost(hostStatus);
      setGameState("waiting");
    },
    []
  );

  // Handle game start from waiting room - now receives questions from server
  const handleGameStart = useCallback((startedRoom: Room, serverQuestions: QuizQuestion[]) => {
    setRoom(startedRoom);
    setQuestions(serverQuestions);
    setGameState("playing");
  }, []);

  // Get questions for the game (called by host)
  const getQuestions = useCallback((gameTopicId: string, count: number): QuizQuestion[] => {
    const topicQuestions = topicContent[gameTopicId]?.quizQuestions ?? [];
    const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, []);

  // Handle leaving the room
  const handleLeave = useCallback(() => {
    setRoom(null);
    setPlayerId(null);
    setIsHost(false);
    setQuestions([]);
    setGameState("lobby");
  }, []);

  // Handle rematch - go back to waiting room, not lobby
  const handleRematch = useCallback(() => {
    setQuestions([]);
    setGameState("waiting");
  }, []);

  // Handle going back to home
  const handleBackToHome = useCallback(() => {
    disconnectSocket();
    router.push("/");
  }, [router]);

  // If not logged in, show nothing (will redirect)
  if (!isLoggedIn || !playerName) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl bg-amber-500 bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center">
              <span className="text-3xl">⚔️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Multiplayer Duel
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Turn-based battle mode</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Game State Indicator */}
          {gameState !== "lobby" && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <div
                className={`w-3 h-3 rounded-full ${
                  gameState === "waiting"
                    ? "bg-amber-500 animate-pulse"
                    : gameState === "playing"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {gameState === "waiting"
                  ? "In Lobby"
                  : gameState === "playing"
                  ? "Game in Progress"
                  : "Game Finished"}
              </span>
            </div>
          )}

          {/* Lobby State */}
          {gameState === "lobby" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
              <Lobby topicId={currentTopicId} gameMode="duel" onRoomJoined={handleRoomJoined} />
            </div>
          )}

          {/* Waiting Room State */}
          {gameState === "waiting" && room && playerId && (
            <WaitingRoom
              room={room}
              playerId={playerId}
              isHost={isHost}
              topicId={currentTopicId}
              gameMode="duel"
              onGameStart={handleGameStart}
              getQuestions={getQuestions}
              onLeave={handleLeave}
            />
          )}

          {/* Playing State */}
          {gameState === "playing" && room && playerId && questions.length > 0 && (
            <DuelGame
              questions={questions}
              room={room}
              socket={getSocket()}
              playerId={playerId}
              onLeave={handleLeave}
              onRematch={handleRematch}
            />
          )}

          {/* Finished State (fallback if DuelGame doesn't handle it) */}
          {gameState === "finished" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg text-center">
              <span className="text-6xl mb-4 block">🏆</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Game Finished!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thanks for playing!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLeave}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all"
                >
                  Play Again
                </button>
                <button
                  onClick={handleBackToHome}
                  className="py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with love for learners everywhere</p>
        </div>
      </footer>
    </main>
  );
}
