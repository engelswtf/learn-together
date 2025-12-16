"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { topics } from "@/data/topics";
import { topicContent } from "@/data/content";
import { Lobby } from "@/components/multiplayer/Lobby";
import { WaitingRoom } from "@/components/multiplayer/WaitingRoom";
import { RaceGame } from "@/components/multiplayer/RaceGame";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { usePlayer } from "@/contexts/PlayerContext";
import { useProgress } from "@/hooks/useProgress";
import type { Room, QuizQuestion } from "@/types";

type GameState = "lobby" | "waiting" | "playing" | "finished";

export default function RacePage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const { playerName, isLoggedIn } = usePlayer();
  const { recordRaceGame } = useProgress();

  const [gameState, setGameState] = useState<GameState>("lobby");
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Get topic info
  const topic = topics.find((t) => t.id === topicId);

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

  // Listen for race-game-over to record stats
  useEffect(() => {
    const socket = getSocket();
    const handleRaceGameOver = (data: { players: Array<{ id: string; name: string; score: number }> }) => {
      if (!playerId) return;
      
      // Find if current player won
      const sortedPlayers = [...data.players].sort((a, b) => b.score - a.score);
      const won = sortedPlayers[0]?.id === playerId;
      recordRaceGame(won);
    };
    socket.on("race-game-over", handleRaceGameOver);
    return () => {
      socket.off("race-game-over", handleRaceGameOver);
    };
  }, [playerId, recordRaceGame]);

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

  // Handle game start from waiting room - receives questions from server
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

  // Handle going back to topic page
  const handleBackToTopic = useCallback(() => {
    disconnectSocket();
    router.push(`/topic/${topicId}`);
  }, [router, topicId]);

  // If not logged in, show nothing (will redirect)
  if (!isLoggedIn || !playerName) {
    return null;
  }

  // If topic not found
  if (!topic) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Topic not found
          </h1>
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <button
            onClick={handleBackToTopic}
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
            Back to {topic.name}
          </button>

          {/* Topic Header */}
          <div className="flex items-center gap-4 mb-2">
            <div
              className={`w-14 h-14 rounded-xl ${topic.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center`}
            >
              <span className="text-3xl">{topic.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Multiplayer Race
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{topic.name}</p>
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
                  ? "Race in Progress"
                  : "Race Finished"}
              </span>
            </div>
          )}

          {/* Lobby State */}
          {gameState === "lobby" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
              <Lobby topicId={topicId} gameMode="race" onRoomJoined={handleRoomJoined} />
            </div>
          )}

          {/* Waiting Room State */}
          {gameState === "waiting" && room && playerId && (
            <WaitingRoom
              room={room}
              playerId={playerId}
              isHost={isHost}
              topicId={topicId}
              gameMode="race"
              onGameStart={handleGameStart}
              getQuestions={getQuestions}
              onLeave={handleLeave}
            />
          )}

          {/* Playing State */}
          {gameState === "playing" && room && playerId && questions.length > 0 && (
            <RaceGame
              questions={questions}
              room={room}
              socket={getSocket()}
              playerId={playerId}
              onLeave={handleLeave}
              onRematch={handleRematch}
            />
          )}

          {/* Finished State (fallback if RaceGame doesn't handle it) */}
          {gameState === "finished" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg text-center">
              <span className="text-6xl mb-4 block">🏁</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Race Finished!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Thanks for racing!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLeave}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all"
                >
                  Race Again
                </button>
                <button
                  onClick={handleBackToTopic}
                  className="py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Back to Topic
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
