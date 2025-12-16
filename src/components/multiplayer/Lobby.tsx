"use client";

import { useState, useCallback } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Room } from "@/types";

interface LobbyProps {
  topicId: string;
  gameMode?: "duel" | "race";
  onRoomJoined: (room: Room, playerId: string, isHost: boolean) => void;
}

type LobbyMode = "select" | "create" | "join";

export function Lobby({ topicId, gameMode = "duel", onRoomJoined }: LobbyProps) {
  const { playerName } = usePlayer();
  const [mode, setMode] = useState<LobbyMode>("select");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = useCallback(async () => {
    if (!playerName) {
      setError("Please login first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const socket = connectSocket();

      socket.emit("create-room", {
        playerName: playerName,
        topicId,
        gameMode,
      });

      socket.once("room-created", (data: { room: Room; playerId: string }) => {
        setIsLoading(false);
        onRoomJoined(data.room, data.playerId, true);
      });

      socket.once("error", (data: { message: string }) => {
        setIsLoading(false);
        setError(data.message);
        disconnectSocket();
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setError("Connection timeout. Please try again.");
          disconnectSocket();
        }
      }, 10000);
    } catch {
      setIsLoading(false);
      setError("Failed to connect. Please try again.");
    }
  }, [playerName, topicId, gameMode, onRoomJoined, isLoading]);

  const handleJoinRoom = useCallback(async () => {
    if (!playerName) {
      setError("Please login first");
      return;
    }

    if (!roomCode.trim() || roomCode.length !== 4) {
      setError("Please enter a valid 4-letter room code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const socket = connectSocket();

      socket.emit("join-room", {
        playerName: playerName,
        code: roomCode.toUpperCase().trim(),
      });

      socket.once("room-joined", (data: { room: Room; playerId: string }) => {
        setIsLoading(false);
        onRoomJoined(data.room, data.playerId, false);
      });

      socket.once("error", (data: { message: string }) => {
        setIsLoading(false);
        setError(data.message);
        disconnectSocket();
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          setError("Connection timeout. Please try again.");
          disconnectSocket();
        }
      }, 10000);
    } catch {
      setIsLoading(false);
      setError("Failed to connect. Please try again.");
    }
  }, [playerName, roomCode, onRoomJoined, isLoading]);

  const handleRoomCodeChange = (value: string) => {
    // Only allow letters, max 4 characters
    const filtered = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4);
    setRoomCode(filtered);
  };

  // Display title based on game mode
  const modeTitle = gameMode === "race" ? "Multiplayer Race" : "Multiplayer Duel";
  const modeEmoji = gameMode === "race" ? "🏁" : "⚔️";

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Selection */}
      {mode === "select" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {modeTitle}
          </h2>

          {/* Player Name Display */}
          <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Playing as</p>
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {playerName}
            </p>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setMode("create")}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🎮</span>
            Create Game
          </button>

          <button
            onClick={() => setMode("join")}
            className="w-full py-4 px-6 rounded-xl bg-white dark:bg-gray-800 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold text-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🔗</span>
            Join Game
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Create Room */}
      {mode === "create" && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setMode("select");
              setError(null);
            }}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">{modeEmoji}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create a {gameMode === "race" ? "Race" : "Game"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Playing as <span className="font-semibold text-indigo-600 dark:text-indigo-400">{playerName}</span>
            </p>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Room...
              </>
            ) : (
              <>
                <span>✨</span>
                Create Room
              </>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Join Room */}
      {mode === "join" && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setMode("select");
              setError(null);
              setRoomCode("");
            }}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="text-center py-4">
            <span className="text-6xl mb-4 block">🔗</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Join a {gameMode === "race" ? "Race" : "Game"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Playing as <span className="font-semibold text-indigo-600 dark:text-indigo-400">{playerName}</span>
            </p>
          </div>

          {/* Room Code Input */}
          <div>
            <label
              htmlFor="roomCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Room Code
            </label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => handleRoomCodeChange(e.target.value)}
              placeholder="ABCD"
              className="w-full px-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-3xl font-mono tracking-[0.5em] uppercase"
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={isLoading || roomCode.length !== 4}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining...
              </>
            ) : (
              <>
                <span>🚀</span>
                Join Room
              </>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
