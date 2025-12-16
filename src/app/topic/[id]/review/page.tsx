"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { topics } from "@/data/topics";
import { getTopicContent } from "@/data/content";
import { useWeakCards } from "@/hooks/useWeakCards";
import { Flashcard } from "@/components/Flashcard";
import { QuizQuestion } from "@/components/QuizQuestion";

type ReviewMode = "flashcards" | "quiz" | "mixed";

// Fisher-Yates shuffle algorithm - unbiased random shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ReviewPage() {
  const params = useParams();
  const topicId = params.id as string;
  const topic = topics.find((t) => t.id === topicId);
  const content = topic ? getTopicContent(topicId) : null;

  const { getWeakCardIds, recordCorrect, recordWrong, isLoaded } = useWeakCards();
  
  const [mode, setMode] = useState<ReviewMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [sessionKey, setSessionKey] = useState(0); // Used to trigger re-shuffle

  // Get weak cards
  const weakFlashcardIds = isLoaded ? getWeakCardIds(topicId, "flashcard") : [];
  const weakQuizIds = isLoaded ? getWeakCardIds(topicId, "quiz") : [];

  const weakFlashcards = content?.flashcards.filter((f) => weakFlashcardIds.includes(f.id)) || [];
  const weakQuizQuestions = content?.quizQuestions.filter((q) => weakQuizIds.includes(q.id)) || [];

  const totalWeakCards = weakFlashcards.length + weakQuizQuestions.length;

  // Shuffle items when mode changes or session restarts
  const shuffledItems = useMemo(() => {
    if (mode === "flashcards") return shuffleArray(weakFlashcards);
    if (mode === "quiz") return shuffleArray(weakQuizQuestions);
    return shuffleArray([...weakFlashcards, ...weakQuizQuestions]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sessionKey, weakFlashcards.length, weakQuizQuestions.length]);

  const currentItem = shuffledItems[currentIndex];

  if (!topic || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Topic not found</p>
      </div>
    );
  }

  const handleFlashcardResponse = (knew: boolean) => {
    if (!currentItem || !("front" in currentItem)) return;
    
    if (knew) {
      recordCorrect(topicId, currentItem.id, "flashcard");
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      recordWrong(topicId, currentItem.id, "flashcard");
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
    
    moveToNext();
  };

  const handleQuizCheck = () => {
    if (selectedAnswer === null || !currentItem || !("correctIndex" in currentItem)) return;
    
    const isCorrect = selectedAnswer === currentItem.correctIndex;
    setShowResult(true);
    
    if (isCorrect) {
      recordCorrect(topicId, currentItem.id, "quiz");
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      recordWrong(topicId, currentItem.id, "quiz");
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const moveToNext = () => {
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowResult(false);
    
    if (currentIndex < shuffledItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setMode(null);
      setCurrentIndex(0);
    }
  };

  const startMode = (newMode: ReviewMode) => {
    setMode(newMode);
    setScore({ correct: 0, incorrect: 0 });
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setSessionKey(prev => prev + 1); // Trigger re-shuffle
  };

  // Mode selection screen
  if (!mode) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Link
            href={`/topic/${topicId}`}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {topic.name}
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
            <span className="text-6xl mb-4 block">🎯</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Review Weak Cards
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Practice the cards you&apos;ve struggled with
            </p>

            {totalWeakCards === 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 mb-6">
                <span className="text-4xl mb-2 block">🎉</span>
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                  No weak cards!
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">
                  You&apos;re doing great! Keep practicing to maintain your knowledge.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {weakFlashcards.length}
                    </div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                      Weak Flashcards
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {weakQuizQuestions.length}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">
                      Weak Quiz Questions
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {weakFlashcards.length > 0 && (
                    <button
                      onClick={() => startMode("flashcards")}
                      className="w-full py-4 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🃏</span>
                      Review {weakFlashcards.length} Flashcards
                    </button>
                  )}
                  {weakQuizQuestions.length > 0 && (
                    <button
                      onClick={() => startMode("quiz")}
                      className="w-full py-4 px-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>❓</span>
                      Review {weakQuizQuestions.length} Quiz Questions
                    </button>
                  )}
                  {weakFlashcards.length > 0 && weakQuizQuestions.length > 0 && (
                    <button
                      onClick={() => startMode("mixed")}
                      className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🔀</span>
                      Review All {totalWeakCards} Cards
                    </button>
                  )}
                </div>
              </>
            )}

            {score.correct + score.incorrect > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Last session:</p>
                <div className="flex justify-center gap-4">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ✓ {score.correct} correct
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ✗ {score.incorrect} incorrect
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Review session
  const progress = ((currentIndex + 1) / shuffledItems.length) * 100;
  const isFlashcardItem = currentItem && "front" in currentItem;
  const isQuizItem = currentItem && "options" in currentItem;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMode(null)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            ← Back
          </button>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {currentIndex + 1} / {shuffledItems.length}
          </span>
        </div>

        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isFlashcardItem && (
          <div className="space-y-6">
            <Flashcard
              front={currentItem.front}
              back={currentItem.back}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
            
            {isFlipped ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleFlashcardResponse(false)}
                  className="py-4 px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
                >
                  🤔 Still Learning
                </button>
                <button
                  onClick={() => handleFlashcardResponse(true)}
                  className="py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  ✓ Got It!
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full py-4 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
              >
                Reveal Answer
              </button>
            )}
          </div>
        )}

        {isQuizItem && (
          <div className="space-y-6">
            <QuizQuestion
              question={currentItem.question}
              options={currentItem.options}
              selectedIndex={selectedAnswer}
              correctIndex={currentItem.correctIndex}
              showResult={showResult}
              onSelect={(i) => !showResult && setSelectedAnswer(i)}
            />
            
            {showResult ? (
              <button
                onClick={moveToNext}
                className="w-full py-4 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
              >
                {currentIndex < shuffledItems.length - 1 ? "Next Question" : "Finish Review"}
              </button>
            ) : (
              <button
                onClick={handleQuizCheck}
                disabled={selectedAnswer === null}
                className={`w-full py-4 px-6 font-semibold rounded-xl transition-colors ${
                  selectedAnswer === null
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}
              >
                Check Answer
              </button>
            )}
          </div>
        )}

        <div className="flex justify-center gap-8 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-gray-600 dark:text-gray-400">
              Correct: {score.correct}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600 dark:text-gray-400">
              Incorrect: {score.incorrect}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
