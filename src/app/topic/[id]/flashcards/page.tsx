"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { topics } from "@/data/topics";
import { getTopicContent } from "@/data/content";
import { FlashcardGame } from "@/components/FlashcardGame";
import { Flashcard } from "@/types";

// Mock flashcards for topics without content
const mockFlashcards: Flashcard[] = [
  { id: "mock-1", front: "Sample Question 1", back: "Sample Answer 1" },
  { id: "mock-2", front: "Sample Question 2", back: "Sample Answer 2" },
  { id: "mock-3", front: "Sample Question 3", back: "Sample Answer 3" },
];

// Fisher-Yates shuffle algorithm - unbiased random shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashcardsPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const topic = topics.find((t) => t.id === topicId);
  const content = getTopicContent(topicId);
  
  // Shuffle flashcards on initial load using useMemo with empty deps
  // This ensures shuffle happens once per page load
  const flashcards = useMemo(() => {
    const cards = content?.flashcards ?? mockFlashcards;
    return shuffleArray(cards);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  if (!topic) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Topic Not Found
          </h1>
          <Link
            href="/"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="pt-6 pb-4 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {topic.name}
          </button>

          {/* Topic Header */}
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl" role="img" aria-label={topic.name}>
              {topic.icon}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {topic.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="text-xl">🎴</span>
                Flashcards Mode
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <FlashcardGame flashcards={flashcards} topic={topic} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Tip: Use keyboard shortcuts - Space to flip, ← for &quot;Still Learning&quot;, → for &quot;I Knew It&quot;</p>
        </div>
      </footer>
    </main>
  );
}
