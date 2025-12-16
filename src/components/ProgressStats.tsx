"use client";

import { useProgress } from "@/hooks/useProgress";

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function OverallProgressCard() {
  const { progress, isLoaded } = useProgress();

  if (!isLoaded || !progress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const { overall } = progress;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Progress</h3>
        {overall.streakDays > 0 && (
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
            <span className="text-xl">🔥</span>
            <span className="font-bold">{overall.streakDays}</span>
            <span className="text-sm opacity-90">day streak</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{overall.totalFlashcardsStudied}</div>
          <div className="text-sm opacity-80">Cards Studied</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{overall.totalQuizAttempts}</div>
          <div className="text-sm opacity-80">Quizzes Taken</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{formatStudyTime(overall.totalStudyTime)}</div>
          <div className="text-sm opacity-80">Study Time</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{formatDate(overall.lastActive)}</div>
          <div className="text-sm opacity-80">Last Active</div>
        </div>
      </div>
    </div>
  );
}

export function TopicProgressCard({ topicId }: { topicId: string }) {
  const { getTopicProgress, isLoaded } = useProgress();

  if (!isLoaded) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  const topicProgress = getTopicProgress(topicId);

  // Show "no progress" only if there's truly no progress at all
  if (!topicProgress) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <span className="text-2xl mb-2 block">📊</span>
          <p className="text-sm">No progress yet</p>
          <p className="text-xs opacity-75">Start studying to track your progress!</p>
        </div>
      </div>
    );
  }

  const { flashcards, quiz } = topicProgress;
  
  // Check if there's ANY progress (including partial sessions)
  const hasFlashcardProgress = flashcards.totalStudied > 0;
  const hasQuizProgress = quiz.totalAttempts > 0 || quiz.totalCorrect > 0 || quiz.totalIncorrect > 0;
  const hasAnyProgress = hasFlashcardProgress || hasQuizProgress;

  // If no progress at all, show the "no progress" state
  if (!hasAnyProgress) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <span className="text-2xl mb-2 block">📊</span>
          <p className="text-sm">No progress yet</p>
          <p className="text-xs opacity-75">Start studying to track your progress!</p>
        </div>
      </div>
    );
  }

  // Calculate percentages for display
  const flashcardKnownPercentage = flashcards.totalStudied > 0 
    ? Math.round((flashcards.totalKnown / flashcards.totalStudied) * 100)
    : 0;
  
  const quizCorrectPercentage = (quiz.totalCorrect + quiz.totalIncorrect) > 0
    ? Math.round((quiz.totalCorrect / (quiz.totalCorrect + quiz.totalIncorrect)) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Your Progress</h4>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Flashcards Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🃏</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Flashcards</span>
          </div>
          {hasFlashcardProgress ? (
            <>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {flashcards.sessionsCompleted > 0 
                  ? `${flashcards.bestKnownPercentage}%`
                  : `${flashcardKnownPercentage}%`
                }
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {flashcards.sessionsCompleted > 0 ? (
                  <>Best score • {flashcards.sessionsCompleted} sessions</>
                ) : (
                  <>{flashcards.totalStudied} cards studied</>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Not started</div>
          )}
        </div>

        {/* Quiz Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">❓</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiz</span>
          </div>
          {hasQuizProgress ? (
            <>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {quiz.bestPercentage > 0 
                  ? `${quiz.bestPercentage}%`
                  : `${quizCorrectPercentage}%`
                }
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {quiz.bestPercentage > 0 ? (
                  <>Best score • {quiz.totalCorrect + quiz.totalIncorrect} questions</>
                ) : (
                  <>{quiz.totalCorrect + quiz.totalIncorrect} questions answered</>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Not started</div>
          )}
        </div>
      </div>

      {/* Last activity */}
      {(flashcards.lastStudied || quiz.lastAttempted) && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last studied: {formatDate(flashcards.lastStudied || quiz.lastAttempted)}
          </div>
        </div>
      )}
    </div>
  );
}

export function MiniProgressBadge({ topicId }: { topicId: string }) {
  const { getTopicProgress, isLoaded } = useProgress();

  if (!isLoaded) return null;

  const topicProgress = getTopicProgress(topicId);
  if (!topicProgress) return null;

  const { flashcards, quiz } = topicProgress;
  
  // Show badge if there's ANY progress (including partial sessions)
  const hasFlashcardProgress = flashcards.totalStudied > 0;
  const hasQuizProgress = quiz.totalAttempts > 0 || quiz.totalCorrect > 0 || quiz.totalIncorrect > 0;
  const hasAnyProgress = hasFlashcardProgress || hasQuizProgress;

  if (!hasAnyProgress) return null;

  // Show best score if available, otherwise show current progress percentage
  let bestScore = 0;
  
  if (flashcards.sessionsCompleted > 0 || quiz.bestPercentage > 0) {
    // Has completed sessions - show best
    bestScore = Math.max(flashcards.bestKnownPercentage, quiz.bestPercentage);
  } else {
    // Only partial progress - calculate current percentage
    const flashcardPct = flashcards.totalStudied > 0 
      ? Math.round((flashcards.totalKnown / flashcards.totalStudied) * 100)
      : 0;
    const quizPct = (quiz.totalCorrect + quiz.totalIncorrect) > 0
      ? Math.round((quiz.totalCorrect / (quiz.totalCorrect + quiz.totalIncorrect)) * 100)
      : 0;
    bestScore = Math.max(flashcardPct, quizPct);
  }

  return (
    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-md flex items-center gap-1">
      <span className="text-xs">⭐</span>
      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{bestScore}%</span>
    </div>
  );
}
