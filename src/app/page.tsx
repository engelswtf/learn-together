"use client";

import Link from "next/link";
import { OverallProgressCard } from "@/components/ProgressStats";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { usePlayer } from "@/contexts/PlayerContext";

interface GameModeCardData {
  id: string;
  name: string;
  description: string;
  icon: string;
  playerType: "Solo" | "Multiplayer";
  gradient: string;
  hoverGradient: string;
  href: string; // Added explicit href
}

const gameModeCards: GameModeCardData[] = [
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Study with flip cards",
    icon: "🃏",
    playerType: "Solo",
    gradient: "from-indigo-500 to-purple-600",
    hoverGradient: "from-indigo-600 to-purple-700",
    href: "/mode/flashcards",
  },
  {
    id: "quiz",
    name: "Quiz",
    description: "Test your knowledge",
    icon: "❓",
    playerType: "Solo",
    gradient: "from-emerald-500 to-teal-600",
    hoverGradient: "from-emerald-600 to-teal-700",
    href: "/mode/quiz",
  },
  {
    id: "duel",
    name: "Duel",
    description: "Turn-based battle",
    icon: "⚔️",
    playerType: "Multiplayer",
    gradient: "from-amber-500 to-orange-600",
    hoverGradient: "from-amber-600 to-orange-700",
    href: "/play/duel",
  },
  {
    id: "race",
    name: "Race",
    description: "First to answer wins",
    icon: "🏁",
    playerType: "Multiplayer",
    gradient: "from-pink-500 to-rose-600",
    hoverGradient: "from-pink-600 to-rose-700",
    href: "/play/race",
  },
];

function GameModeCard({ mode }: { mode: GameModeCardData }) {
  return (
    <Link href={mode.href}>
      <div className={`
        group relative overflow-hidden rounded-2xl p-6 
        bg-gradient-to-br ${mode.gradient}
        hover:bg-gradient-to-br hover:${mode.hoverGradient}
        shadow-lg hover:shadow-2xl 
        transition-all duration-300 hover:-translate-y-2 
        cursor-pointer h-full min-h-[200px]
        flex flex-col justify-between
      `}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-4">
            <span 
              className="text-6xl drop-shadow-lg" 
              role="img" 
              aria-label={mode.name}
            >
              {mode.icon}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform origin-left">
            {mode.name}
          </h3>
          
          {/* Description */}
          <p className="text-white/90 text-sm mb-4">
            {mode.description}
          </p>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Player type badge */}
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
            ${mode.playerType === "Solo"
              ? "bg-white/20 text-white"
              : "bg-white/20 text-white"
            }
          `}>
            {mode.playerType === "Solo" ? "👤" : "👥"} {mode.playerType}
          </span>
          
          {/* Arrow indicator */}
          <span className="text-white/80 group-hover:text-white transition-colors">
            <svg
              className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { isLoggedIn, isLoading, playerName, logout } = usePlayer();

  // Show loading state
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

  // Show welcome screen if not logged in
  if (!isLoggedIn) {
    return <WelcomeScreen />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <header className="pt-16 pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-6">
            <span className="text-6xl mb-4 block">🎓</span>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              LearnTogether
            </h1>
          </div>
          
          {/* Welcome message with player name */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{playerName}</span>!
            <span className="block mt-2 text-indigo-600 dark:text-indigo-400 font-medium">
              Choose how you want to learn!
            </span>
          </p>

          {/* Logout button */}
          <button
            onClick={logout}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Switch Player
          </button>
        </div>
      </header>

      {/* Progress Section */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <OverallProgressCard />
        </div>
      </section>

      {/* Game Modes Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Game Modes
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {gameModeCards.length} modes
            </span>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameModeCards.map((mode) => (
              <GameModeCard key={mode.id} mode={mode} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with love for learners everywhere</p>
        </div>
      </footer>
    </main>
  );
}
