"use client";

import { useCallback } from "react";
import { usePlayer, TopicProgress, ProgressData } from "@/contexts/PlayerContext";

const defaultTopicProgress = (topicId: string): TopicProgress => ({
  topicId,
  flashcards: {
    totalStudied: 0,
    totalKnown: 0,
    totalUnknown: 0,
    lastStudied: null,
    sessionsCompleted: 0,
    bestKnownPercentage: 0,
  },
  quiz: {
    totalAttempts: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    lastAttempted: null,
    bestScore: 0,
    bestPercentage: 0,
    averagePercentage: 0,
  },
});

export type { TopicProgress } from "@/contexts/PlayerContext";

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

export function useProgress() {
  const { progress, isLoading, updateProgress, saveProgress } = usePlayer();

  // Update streak
  const updateStreak = useCallback((prev: ProgressData): ProgressData => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = prev.overall.lastStreakDate;

    if (!lastDate) {
      // First activity
      return {
        ...prev,
        overall: {
          ...prev.overall,
          streakDays: 1,
          lastStreakDate: today,
          lastActive: new Date().toISOString(),
        },
      };
    } else if (lastDate === today) {
      // Already active today, just update lastActive
      return {
        ...prev,
        overall: {
          ...prev.overall,
          lastActive: new Date().toISOString(),
        },
      };
    } else {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day - increase streak
        return {
          ...prev,
          overall: {
            ...prev.overall,
            streakDays: prev.overall.streakDays + 1,
            lastStreakDate: today,
            lastActive: new Date().toISOString(),
          },
        };
      } else {
        // Streak broken - reset to 1
        return {
          ...prev,
          overall: {
            ...prev.overall,
            streakDays: 1,
            lastStreakDate: today,
            lastActive: new Date().toISOString(),
          },
        };
      }
    }
  }, []);

  // Record a single flashcard answer (incremental save)
  const recordFlashcardAnswer = useCallback(
    (topicId: string, knew: boolean) => {
      if (!progress) return;

      updateProgress((prev) => {
        const topic = prev.topics[topicId] || defaultTopicProgress(topicId);
        
        const updated = {
          ...prev,
          topics: {
            ...prev.topics,
            [topicId]: {
              ...topic,
              flashcards: {
                ...topic.flashcards,
                totalStudied: topic.flashcards.totalStudied + 1,
                totalKnown: topic.flashcards.totalKnown + (knew ? 1 : 0),
                totalUnknown: topic.flashcards.totalUnknown + (knew ? 0 : 1),
                lastStudied: new Date().toISOString(),
              },
              quiz: topic.quiz,
            },
          },
          overall: {
            ...prev.overall,
            totalFlashcardsStudied: prev.overall.totalFlashcardsStudied + 1,
            totalStudyTime: prev.overall.totalStudyTime + 0.5, // ~30 seconds per card
          },
        };

        return updateStreak(updated);
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, updateStreak, saveProgress]
  );

  // Record a single quiz answer (incremental save)
  const recordQuizAnswer = useCallback(
    (topicId: string, correct: boolean) => {
      if (!progress) return;

      updateProgress((prev) => {
        const topic = prev.topics[topicId] || defaultTopicProgress(topicId);
        
        const updated = {
          ...prev,
          topics: {
            ...prev.topics,
            [topicId]: {
              ...topic,
              flashcards: topic.flashcards,
              quiz: {
                ...topic.quiz,
                totalAttempts: topic.quiz.totalAttempts + 1,
                totalCorrect: topic.quiz.totalCorrect + (correct ? 1 : 0),
                totalIncorrect: topic.quiz.totalIncorrect + (correct ? 0 : 1),
                lastAttempted: new Date().toISOString(),
                // Update average percentage based on all answers
                averagePercentage: Math.round(
                  ((topic.quiz.totalCorrect + (correct ? 1 : 0)) / 
                   (topic.quiz.totalAttempts + 1)) * 100
                ),
              },
            },
          },
          overall: {
            ...prev.overall,
            totalStudyTime: prev.overall.totalStudyTime + 1, // ~1 minute per question
          },
        };

        return updateStreak(updated);
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, updateStreak, saveProgress]
  );

  // Record flashcard session completion (for best percentage and session count)
  const recordFlashcardSessionComplete = useCallback(
    (topicId: string, totalCards: number, knownCount: number) => {
      if (!progress) return;

      const knownPercentage = Math.round((knownCount / totalCards) * 100);

      updateProgress((prev) => {
        const topic = prev.topics[topicId] || defaultTopicProgress(topicId);
        
        const updated = {
          ...prev,
          topics: {
            ...prev.topics,
            [topicId]: {
              ...topic,
              flashcards: {
                ...topic.flashcards,
                sessionsCompleted: topic.flashcards.sessionsCompleted + 1,
                bestKnownPercentage: Math.max(topic.flashcards.bestKnownPercentage, knownPercentage),
              },
              quiz: topic.quiz,
            },
          },
        };

        return updated;
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, saveProgress]
  );

  // Record quiz session completion (for best percentage, best score, and quiz attempts count)
  const recordQuizSessionComplete = useCallback(
    (topicId: string, totalQuestions: number, correctCount: number) => {
      if (!progress) return;

      const percentage = Math.round((correctCount / totalQuestions) * 100);

      updateProgress((prev) => {
        const topic = prev.topics[topicId] || defaultTopicProgress(topicId);
        
        const updated = {
          ...prev,
          topics: {
            ...prev.topics,
            [topicId]: {
              ...topic,
              flashcards: topic.flashcards,
              quiz: {
                ...topic.quiz,
                bestScore: Math.max(topic.quiz.bestScore, correctCount),
                bestPercentage: Math.max(topic.quiz.bestPercentage, percentage),
              },
            },
          },
          overall: {
            ...prev.overall,
            totalQuizAttempts: prev.overall.totalQuizAttempts + 1,
          },
        };

        return updated;
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, saveProgress]
  );

  // Legacy: Record flashcard session completion (kept for backwards compatibility)
  const recordFlashcardSession = useCallback(
    (topicId: string, totalCards: number, knownCount: number, unknownCount: number) => {
      if (!progress) return;

      const knownPercentage = Math.round((knownCount / totalCards) * 100);

      updateProgress((prev) => {
        const topic = prev.topics[topicId] || defaultTopicProgress(topicId);
        
        const updated = {
          ...prev,
          topics: {
            ...prev.topics,
            [topicId]: {
              ...topic,
              flashcards: {
                totalStudied: topic.flashcards.totalStudied + totalCards,
                totalKnown: topic.flashcards.totalKnown + knownCount,
                totalUnknown: topic.flashcards.totalUnknown + unknownCount,
                lastStudied: new Date().toISOString(),
                sessionsCompleted: topic.flashcards.sessionsCompleted + 1,
                bestKnownPercentage: Math.max(topic.flashcards.bestKnownPercentage, knownPercentage),
              },
              quiz: topic.quiz,
            },
          },
          overall: {
            ...prev.overall,
            totalFlashcardsStudied: prev.overall.totalFlashcardsStudied + totalCards,
            totalStudyTime: prev.overall.totalStudyTime + Math.ceil(totalCards * 0.5),
          },
        };

        return updateStreak(updated);
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, updateStreak, saveProgress]
  );

  // Legacy: Record quiz completion (kept for backwards compatibility)
  const recordQuizSession = useCallback(
    (topicId: string, totalQuestions: number, correctCount: number) => {
      if (!progress) return;

      const percentage = Math.round((correctCount / totalQuestions) * 100);
      const incorrectCount = totalQuestions - correctCount;

      updateProgress((prev) => {
        const topic = prev.topics[topicId] || defaultTopicProgress(topicId);
        const newTotalAttempts = topic.quiz.totalAttempts + 1;
        const newTotalCorrect = topic.quiz.totalCorrect + correctCount;
        const newTotalIncorrect = topic.quiz.totalIncorrect + incorrectCount;
        const newAveragePercentage = Math.round(
          (newTotalCorrect / (newTotalCorrect + newTotalIncorrect)) * 100
        );

        const updated = {
          ...prev,
          topics: {
            ...prev.topics,
            [topicId]: {
              ...topic,
              flashcards: topic.flashcards,
              quiz: {
                totalAttempts: newTotalAttempts,
                totalCorrect: newTotalCorrect,
                totalIncorrect: newTotalIncorrect,
                lastAttempted: new Date().toISOString(),
                bestScore: Math.max(topic.quiz.bestScore, correctCount),
                bestPercentage: Math.max(topic.quiz.bestPercentage, percentage),
                averagePercentage: newAveragePercentage,
              },
            },
          },
          overall: {
            ...prev.overall,
            totalQuizAttempts: prev.overall.totalQuizAttempts + 1,
            totalStudyTime: prev.overall.totalStudyTime + Math.ceil(totalQuestions * 1),
          },
        };

        return updateStreak(updated);
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, updateStreak, saveProgress]
  );

  // Record duel game result
  const recordDuelGame = useCallback(
    (won: boolean) => {
      if (!progress) return;

      updateProgress((prev) => {
        const updated = {
          ...prev,
          overall: {
            ...prev.overall,
            duelGamesPlayed: prev.overall.duelGamesPlayed + 1,
            duelGamesWon: prev.overall.duelGamesWon + (won ? 1 : 0),
          },
        };

        return updateStreak(updated);
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, updateStreak, saveProgress]
  );

  // Record race game result
  const recordRaceGame = useCallback(
    (won: boolean) => {
      if (!progress) return;

      updateProgress((prev) => {
        const updated = {
          ...prev,
          overall: {
            ...prev.overall,
            raceGamesPlayed: prev.overall.raceGamesPlayed + 1,
            raceGamesWon: prev.overall.raceGamesWon + (won ? 1 : 0),
          },
        };

        return updateStreak(updated);
      });

      // Save to server after update
      setTimeout(() => saveProgress(), 100);
    },
    [progress, updateProgress, updateStreak, saveProgress]
  );

  // Get progress for a specific topic
  const getTopicProgress = useCallback(
    (topicId: string): TopicProgress | null => {
      if (!progress) return null;
      return progress.topics[topicId] || null;
    },
    [progress]
  );

  // Reset all progress
  const resetProgress = useCallback(() => {
    updateProgress((prev) => ({
      ...prev,
      topics: {},
      overall: {
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
      },
    }));
    setTimeout(() => saveProgress(), 100);
  }, [updateProgress, saveProgress]);

  // Reset progress for a specific topic
  const resetTopicProgress = useCallback((topicId: string) => {
    if (!progress) return;
    
    updateProgress((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [topicId]: _removed, ...rest } = prev.topics;
      return { ...prev, topics: rest };
    });
    setTimeout(() => saveProgress(), 100);
  }, [progress, updateProgress, saveProgress]);

  return {
    progress,
    isLoaded: !isLoading,
    // New incremental recording functions
    recordFlashcardAnswer,
    recordQuizAnswer,
    recordFlashcardSessionComplete,
    recordQuizSessionComplete,
    // Legacy session recording (kept for backwards compatibility)
    recordFlashcardSession,
    recordQuizSession,
    // Game recording
    recordDuelGame,
    recordRaceGame,
    // Progress getters
    getTopicProgress,
    // Reset functions
    resetProgress,
    resetTopicProgress,
  };
}
