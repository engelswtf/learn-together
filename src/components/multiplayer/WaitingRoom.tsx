"use client";

import { useState, useEffect, useCallback } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { topics } from "@/data/topics";
import type { Room, Player, Topic } from "@/types";

import type { QuizQuestion } from "@/types";

interface WaitingRoomProps {
  room: Room;
  playerId: string;
  isHost: boolean;
  topicId: string;
  gameMode?: "duel" | "race";
  onGameStart: (room: Room, questions: QuizQuestion[]) => void;
  getQuestions: (topicId: string, count: number) => QuizQuestion[];
  onLeave: () => void;
}

// Player avatar colors
const avatarColors = [
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-teal-500",
];

export function WaitingRoom({
  room: initialRoom,
  playerId,
  isHost,
  topicId,
  gameMode = "duel",
  onGameStart,
  getQuestions,
  onLeave,
}: WaitingRoomProps) {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(topicId);
  const [questionCount, setQuestionCount] = useState(10);
  const [isStarting, setIsStarting] = useState(false);

  // Get current topic info
  const currentTopic = topics.find((t) => t.id === selectedTopic);

  // Socket event handlers
  useEffect(() => {
    const socket = getSocket();
    console.log("[WaitingRoom] Setting up socket listeners, connected:", socket.connected, "gameMode:", gameMode);

    const handlePlayerJoined = (data: { room: Room }) => {
      setRoom(data.room);
    };

    const handlePlayerLeft = (data: { room: Room }) => {
      setRoom(data.room);
    };

    const handleRoomUpdated = (data: { room: Room }) => {
      setRoom(data.room);
    };

    const handleTopicSelected = (data: { topicId: string }) => {
      console.log("[WaitingRoom] topic-selected received:", data.topicId);
      setSelectedTopic(data.topicId);
    };

    const handleGameStarted = (data: { room: Room; questions: QuizQuestion[] }) => {
      console.log("[WaitingRoom] game-started received:", data);
      onGameStart(data.room, data.questions);
    };

    const handleRaceGameStarted = (data: { room: Room; questions: QuizQuestion[] }) => {
      console.log("[WaitingRoom] race-game-started received:", data);
      onGameStart(data.room, data.questions);
    };

    const handleHostLeft = () => {
      alert("The host has left the game.");
      onLeave();
    };

    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-left", handlePlayerLeft);
    socket.on("room-updated", handleRoomUpdated);
    socket.on("topic-selected", handleTopicSelected);
    socket.on("game-started", handleGameStarted);
    socket.on("race-game-started", handleRaceGameStarted);
    socket.on("host-left", handleHostLeft);

    return () => {
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-left", handlePlayerLeft);
      socket.off("room-updated", handleRoomUpdated);
      socket.off("topic-selected", handleTopicSelected);
      socket.off("game-started", handleGameStarted);
      socket.off("race-game-started", handleRaceGameStarted);
      socket.off("host-left", handleHostLeft);
    };
  }, [onGameStart, gameMode, onLeave]);

  // Copy room code to clipboard
  const copyRoomCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = room.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [room.code]);

  // Handle topic change (host only)
  const handleTopicChange = useCallback(
    (newTopicId: string) => {
      setSelectedTopic(newTopicId);
      const socket = getSocket();
      socket.emit("select-topic", {
        code: room.code,
        topicId: newTopicId,
      });
    },
    [room.code]
  );

  // Handle question count change (host only)
  const handleQuestionCountChange = useCallback(
    (count: number) => {
      setQuestionCount(count);
    },
    []
  );

  // Start the game (host only)
  const handleStartGame = useCallback(() => {
    console.log("[WaitingRoom] handleStartGame called, isHost:", isHost, "players:", room.players.length, "gameMode:", gameMode);
    if (!isHost || room.players.length < 2) return;

    setIsStarting(true);
    const socket = getSocket();
    const questions = getQuestions(selectedTopic, questionCount);
    
    console.log("[WaitingRoom] Emitting start-game");
    socket.emit("start-game", {
      code: room.code,
      questions,
    });
  }, [isHost, room.code, room.players.length, selectedTopic, questionCount, getQuestions, gameMode]);

  // Leave the room
  const handleLeaveRoom = useCallback(() => {
    const socket = getSocket();
    socket.emit("leave-room", { roomCode: room.code });
    disconnectSocket();
    onLeave();
  }, [room.code, onLeave]);

  // Get avatar color for player
  const getAvatarColor = (index: number) => {
    return avatarColors[index % avatarColors.length];
  };

  // Get player initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Display text based on game mode
  const modeTitle = gameMode === "race" ? "Race" : "Duel";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Room Code Display */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Room Code</p>
        <div className="flex items-center justify-center gap-4">
          <div className="px-8 py-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-600">
            <span className="text-4xl md:text-5xl font-mono font-bold tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              {room.code}
            </span>
          </div>
          <button
            onClick={copyRoomCode}
            className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
            title="Copy room code"
          >
            {copied ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
        {copied && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2 animate-pulse">
            Copied to clipboard!
          </p>
        )}
      </div>

      {/* Players List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Players ({room.players.length}/4)
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {room.players.length < 2 ? "Waiting for players..." : "Ready to start!"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {room.players.map((player: Player, index: number) => (
            <div
              key={player.id}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                player.id === playerId
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
              }`}
            >
              {/* Host Badge */}
              {player.id === room.hostId && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                  Host
                </span>
              )}

              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full ${getAvatarColor(index)} flex items-center justify-center mx-auto mb-2`}
              >
                <span className="text-white font-bold text-lg">{getInitials(player.name)}</span>
              </div>

              {/* Name */}
              <p className="text-center text-sm font-medium text-gray-900 dark:text-white truncate">
                {player.name}
                {player.id === playerId && (
                  <span className="text-indigo-600 dark:text-indigo-400"> (You)</span>
                )}
              </p>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 4 - room.players.length) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-400 dark:text-gray-500 text-2xl">?</span>
              </div>
              <p className="text-center text-sm text-gray-400 dark:text-gray-500">Waiting...</p>
            </div>
          ))}
        </div>
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {modeTitle} Settings
          </h3>

          {/* Topic Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {topics.map((topic: Topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicChange(topic.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedTopic === topic.id
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{topic.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {topic.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Questions
            </label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => handleQuestionCountChange(count)}
                  className={`flex-1 py-2 px-4 rounded-xl border-2 font-medium transition-all ${
                    questionCount === count
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guest Waiting Message */}
      {!isHost && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6 mb-6 text-center">
          <div className="animate-pulse mb-2">
            <span className="text-4xl">{gameMode === "race" ? "🏁" : "⏳"}</span>
          </div>
          <p className="text-indigo-700 dark:text-indigo-300 font-medium">
            Waiting for host to start the {modeTitle.toLowerCase()}...
          </p>
          {currentTopic && (
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
              Topic: {currentTopic.icon} {currentTopic.name}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleLeaveRoom}
          className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          Leave Room
        </button>

        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={room.players.length < 2 || isStarting}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isStarting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Starting...
              </>
            ) : (
              <>
                <span>{gameMode === "race" ? "🏁" : "🚀"}</span>
                Start {modeTitle}
              </>
            )}
          </button>
        )}
      </div>

      {isHost && room.players.length < 2 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Need at least 2 players to start
        </p>
      )}
    </div>
  );
}
