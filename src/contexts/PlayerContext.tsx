"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

export interface TopicProgress {
  topicId: string;
  flashcards: {
    totalStudied: number;
    totalKnown: number;
    totalUnknown: number;
    lastStudied: string | null;
    sessionsCompleted: number;
    bestKnownPercentage: number;
  };
  quiz: {
    totalAttempts: number;
    totalCorrect: number;
    totalIncorrect: number;
    lastAttempted: string | null;
    bestScore: number;
    bestPercentage: number;
    averagePercentage: number;
  };
}

export interface OverallProgress {
  totalFlashcardsStudied: number;
  totalQuizAttempts: number;
  totalStudyTime: number;
  lastActive: string | null;
  streakDays: number;
  lastStreakDate: string | null;
  duelGamesPlayed: number;
  duelGamesWon: number;
  raceGamesPlayed: number;
  raceGamesWon: number;
}

export interface ProgressData {
  playerName: string;
  topics: Record<string, TopicProgress>;
  overall: OverallProgress;
}

interface PlayerContextType {
  playerName: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  progress: ProgressData | null;
  login: (name: string) => Promise<{ isReturning: boolean }>;
  logout: () => void;
  saveProgress: () => Promise<void>;
  updateProgress: (updater: (prev: ProgressData) => ProgressData) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const STORAGE_KEY = "learn-together-player";

const defaultOverall: OverallProgress = {
  totalFlashcardsStudied: 0,
  totalQuizAttempts: 0,
  totalStudyTime: 0,
  lastActive: null,
  streakDays: 0,
  lastStreakDate: null,
  duelGamesPlayed: 0,
  duelGamesWon: 0,
  raceGamesPlayed: 0,
  raceGamesWon: 0,
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use refs to always have the latest values for saveProgress
  const progressRef = useRef<ProgressData | null>(null);
  const playerNameRef = useRef<string | null>(null);
  
  // Keep refs in sync with state
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  
  useEffect(() => {
    playerNameRef.current = playerName;
  }, [playerName]);

  // Check localStorage on mount for existing session
  useEffect(() => {
    const storedName = localStorage.getItem(STORAGE_KEY);
    if (storedName) {
      // Auto-login with stored name
      loginWithName(storedName).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithName = async (name: string): Promise<{ isReturning: boolean }> => {
    try {
      const response = await fetch("/api/progress/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name }),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      setPlayerName(name);
      setProgress(data.progress);
      localStorage.setItem(STORAGE_KEY, name);

      return { isReturning: data.isReturning };
    } catch (error) {
      console.error("Login error:", error);
      // Fallback to local-only mode
      const localProgress: ProgressData = {
        playerName: name,
        topics: {},
        overall: defaultOverall,
      };
      setPlayerName(name);
      setProgress(localProgress);
      localStorage.setItem(STORAGE_KEY, name);
      return { isReturning: false };
    }
  };

  const login = useCallback(async (name: string): Promise<{ isReturning: boolean }> => {
    setIsLoading(true);
    try {
      return await loginWithName(name);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Save progress before logging out using refs for latest values
    if (progressRef.current && playerNameRef.current) {
      fetch("/api/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerNameRef.current, progress: progressRef.current }),
      }).catch(console.error);
    }

    setPlayerName(null);
    setProgress(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // saveProgress now uses refs to always get the latest values
  const saveProgress = useCallback(async () => {
    const currentProgress = progressRef.current;
    const currentPlayerName = playerNameRef.current;
    
    if (!currentProgress || !currentPlayerName) return;

    try {
      await fetch("/api/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: currentPlayerName, progress: currentProgress }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, []);

  const updateProgress = useCallback((updater: (prev: ProgressData) => ProgressData) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  }, []);

  // Auto-save progress periodically and on unmount
  useEffect(() => {
    if (!progress || !playerName) return;

    const interval = setInterval(() => {
      saveProgress();
    }, 60000); // Save every minute

    return () => {
      clearInterval(interval);
      // Save on unmount
      saveProgress();
    };
  }, [progress, playerName, saveProgress]);

  // Save progress when window is about to close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (progressRef.current && playerNameRef.current) {
        // Use sendBeacon for reliable save on page close
        const data = JSON.stringify({ playerName: playerNameRef.current, progress: progressRef.current });
        navigator.sendBeacon("/api/progress/save", data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        playerName,
        isLoggedIn: !!playerName,
        isLoading,
        progress,
        login,
        logout,
        saveProgress,
        updateProgress,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
