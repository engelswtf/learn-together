"use client";

import Link from "next/link";
import { GameModeInfo } from "@/data/gameModes";

interface GameModeCardProps {
  mode: GameModeInfo;
  topicId: string;
  accentColor: string;
}

export function GameModeCard({ mode, topicId, accentColor }: GameModeCardProps) {
  const cardContent = (
    <>
      {/* Colored accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor} ${!mode.available && "opacity-50"}`} />
      
      {/* Coming Soon Badge */}
      {!mode.available && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            Coming Soon
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4">
        <span 
          className={`text-5xl ${!mode.available && "grayscale"}`} 
          role="img" 
          aria-label={mode.name}
        >
          {mode.icon}
        </span>
      </div>

      {/* Content */}
      <h3 className={`
        text-xl font-bold mb-2 transition-colors
        ${mode.available 
          ? "text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400" 
          : "text-gray-500 dark:text-gray-400"
        }
      `}>
        {mode.name}
      </h3>

      <p className={`
        text-sm mb-4
        ${mode.available 
          ? "text-gray-600 dark:text-gray-300" 
          : "text-gray-400 dark:text-gray-500"
        }
      `}>
        {mode.description}
      </p>

      {/* Player count badge */}
      <div className="flex items-center justify-between">
        <span className={`
          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
          ${mode.playerCount === "solo"
            ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
            : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
          }
          ${!mode.available && "opacity-50"}
        `}>
          {mode.playerCount === "solo" ? "👤 Solo" : "👥 Multiplayer"}
        </span>

        {/* Arrow indicator (only for available modes) */}
        {mode.available && (
          <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
        )}
      </div>
    </>
  );

  const cardClasses = `
    relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 
    border border-gray-100 dark:border-gray-700
    transition-all duration-300 block
    ${mode.available 
      ? "shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer group" 
      : "opacity-60 cursor-not-allowed"
    }
  `;

  if (mode.available) {
    return (
      <Link href={`/topic/${topicId}/${mode.id}`} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
}
