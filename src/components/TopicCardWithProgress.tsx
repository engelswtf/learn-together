"use client";

import Link from "next/link";
import { useWeakCards } from "@/hooks/useWeakCards";
import { useProgress } from "@/hooks/useProgress";

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  cardCount: number;
}

interface TopicCardWithProgressProps {
  topic: Topic;
  mode: string;
  modeGradient: string;
}

export function TopicCardWithProgress({ topic, mode, modeGradient }: TopicCardWithProgressProps) {
  const { getTotalWeakCards, isLoaded: weakCardsLoaded } = useWeakCards();
  const { getTopicProgress, isLoaded: progressLoaded } = useProgress();

  const weakCardCount = weakCardsLoaded ? getTotalWeakCards(topic.id) : 0;
  const topicProgress = progressLoaded ? getTopicProgress(topic.id) : null;

  // Get progress display based on mode
  const getProgressDisplay = () => {
    if (!topicProgress) return null;

    if (mode === "quiz") {
      const { quiz } = topicProgress;
      if (quiz.totalAttempts === 0) return null;
      return {
        primary: `${quiz.bestPercentage}% best`,
        secondary: `${quiz.totalAttempts} attempts`,
      };
    } else {
      const { flashcards } = topicProgress;
      if (flashcards.totalStudied === 0) return null;
      return {
        primary: `${flashcards.bestKnownPercentage}% best`,
        secondary: `${flashcards.totalStudied} studied`,
      };
    }
  };

  const progressDisplay = getProgressDisplay();

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Colored accent bar with mode gradient */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${modeGradient}`} />
      
      {/* Main card link */}
      <Link href={`/topic/${topic.id}/${mode}`} className="block p-6 pb-4">
        {/* Icon */}
        <div className="mb-4">
          <span className="text-5xl" role="img" aria-label={topic.name}>
            {topic.icon}
          </span>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {topic.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {topic.description}
        </p>
        
        {/* Card count badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
            {mode === "quiz" ? "❓" : "📚"} {topic.cardCount} {mode === "quiz" ? "questions" : "cards"}
          </span>
          
          {/* Arrow indicator */}
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
        </div>
      </Link>

      {/* Progress and Weak Cards Section */}
      {(progressDisplay || weakCardCount > 0) && (
        <div className="px-6 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between gap-2">
            {/* Progress indicator */}
            {progressDisplay && (
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  ⭐ {progressDisplay.primary}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {progressDisplay.secondary}
                </span>
              </div>
            )}
            
            {/* Weak cards badge with review link */}
            {weakCardCount > 0 && (
              <Link
                href={`/topic/${topic.id}/review`}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/70 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                🔄 {weakCardCount} to review
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
