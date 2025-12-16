"use client";

import Link from "next/link";
import { useWeakCards } from "@/hooks/useWeakCards";

interface WeakCardsButtonProps {
  topicId: string;
}

export function WeakCardsButton({ topicId }: WeakCardsButtonProps) {
  const { getTotalWeakCards, isLoaded } = useWeakCards();

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  const weakCount = getTotalWeakCards(topicId);

  if (weakCount === 0) {
    return null;
  }

  return (
    <Link
      href={`/topic/${topicId}/review`}
      className="block bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 rounded-xl p-4 text-white transition-all shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h3 className="font-semibold">Review Weak Cards</h3>
            <p className="text-sm opacity-90">
              {weakCount} card{weakCount !== 1 ? "s" : ""} need practice
            </p>
          </div>
        </div>
        <svg
          className="w-6 h-6"
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
      </div>
    </Link>
  );
}
