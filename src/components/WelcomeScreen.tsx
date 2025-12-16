"use client";

import { useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";

export function WelcomeScreen() {
  const { login, isLoading } = usePlayer();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (trimmedName.length > 20) {
      setError("Name must be 20 characters or less");
      return;
    }

    // Basic sanitization check
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      setError("Name can only contain letters, numbers, spaces, hyphens, and underscores");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(trimmedName);
      if (result.isReturning) {
        setWelcomeBack(trimmedName);
        // Brief delay to show welcome back message
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch {
      setError("Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (welcomeBack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
        <div className="text-center animate-pulse">
          <span className="text-6xl mb-6 block">👋</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{welcomeBack}</span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🎓</span>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            LearnTogether
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Master any topic with flashcards, quizzes, and multiplayer challenges
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Welcome!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Enter your name to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="playerName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="playerName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || name.trim().length < 2}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
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
                  <span>🚀</span>
                  Start Learning
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            Your progress will be saved automatically
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
            <span className="text-2xl block mb-1">📚</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Flashcards</span>
          </div>
          <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
            <span className="text-2xl block mb-1">🧠</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Quizzes</span>
          </div>
          <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50">
            <span className="text-2xl block mb-1">⚔️</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Multiplayer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
