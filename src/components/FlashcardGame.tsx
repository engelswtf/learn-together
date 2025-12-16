"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Flashcard as FlashcardType, Topic } from "@/types";
import { Flashcard } from "./Flashcard";
import { useProgress } from "@/hooks/useProgress";
import { useWeakCards } from "@/hooks/useWeakCards";

interface FlashcardGameProps {
  flashcards: FlashcardType[];
  topic: Topic;
}

type GameState = "playing" | "finished";

// Fisher-Yates shuffle algorithm - unbiased random shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function FlashcardGame({ flashcards, topic }: FlashcardGameProps) {
  const [cards, setCards] = useState<FlashcardType[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  const [unknownCards, setUnknownCards] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [sessionCompleteSaved, setSessionCompleteSaved] = useState(false);
  
  // Track cards already recorded in this session to avoid double-counting on restart
  const recordedCardsRef = useRef<Set<string>>(new Set());

  const { recordFlashcardAnswer, recordFlashcardSessionComplete, getTopicProgress, isLoaded } = useProgress();
  const { recordWrong, recordCorrect } = useWeakCards();
  const topicProgress = isLoaded ? getTopicProgress(topic.id) : null;

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const moveToNextCard = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameState("finished");
    }
  }, [currentIndex, cards.length]);

  const handleKnew = useCallback(() => {
    if (!currentCard) return;
    setKnownCards((prev) => [...prev, currentCard.id]);
    // Record as correct for weak cards tracking
    recordCorrect(topic.id, currentCard.id, "flashcard");
    
    // Save progress incrementally (only if not already recorded in this session)
    if (!recordedCardsRef.current.has(currentCard.id)) {
      recordFlashcardAnswer(topic.id, true);
      recordedCardsRef.current.add(currentCard.id);
    }
    
    moveToNextCard();
  }, [currentCard, moveToNextCard, recordCorrect, recordFlashcardAnswer, topic.id]);

  const handleStillLearning = useCallback(() => {
    if (!currentCard) return;
    setUnknownCards((prev) => [...prev, currentCard.id]);
    // Record as wrong for weak cards tracking
    recordWrong(topic.id, currentCard.id, "flashcard");
    
    // Save progress incrementally (only if not already recorded in this session)
    if (!recordedCardsRef.current.has(currentCard.id)) {
      recordFlashcardAnswer(topic.id, false);
      recordedCardsRef.current.add(currentCard.id);
    }
    
    moveToNextCard();
  }, [currentCard, moveToNextCard, recordWrong, recordFlashcardAnswer, topic.id]);

  // Save session completion stats when game finishes (for best percentage and session count)
  useEffect(() => {
    if (gameState === "finished" && !sessionCompleteSaved && cards.length > 0) {
      recordFlashcardSessionComplete(topic.id, cards.length, knownCards.length);
      setSessionCompleteSaved(true);
    }
  }, [gameState, sessionCompleteSaved, cards.length, knownCards.length, topic.id, recordFlashcardSessionComplete]);

  const shuffleCards = useCallback(() => {
    const shuffled = shuffleArray(flashcards);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setUnknownCards([]);
    setGameState("playing");
    setSessionCompleteSaved(false);
    // Reset recorded cards for new session
    recordedCardsRef.current = new Set();
  }, [flashcards]);

  const restartGame = useCallback(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setUnknownCards([]);
    setGameState("playing");
    setSessionCompleteSaved(false);
    // Reset recorded cards for new session
    recordedCardsRef.current = new Set();
  }, [flashcards]);

  const reviewUnknown = useCallback(() => {
    const unknownFlashcards = flashcards.filter((card) =>
      unknownCards.includes(card.id)
    );
    if (unknownFlashcards.length > 0) {
      setCards(unknownFlashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownCards([]);
      setUnknownCards([]);
      setGameState("playing");
      setSessionCompleteSaved(false);
      // Reset recorded cards for review session
      recordedCardsRef.current = new Set();
    }
  }, [flashcards, unknownCards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      
      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          handleFlip();
          break;
        case "ArrowLeft":
          if (isFlipped) {
            e.preventDefault();
            handleStillLearning();
          }
          break;
        case "ArrowRight":
          if (isFlipped) {
            e.preventDefault();
            handleKnew();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, isFlipped, handleFlip, handleKnew, handleStillLearning]);

  // Finished state
  if (gameState === "finished") {
    const knownPercentage = Math.round((knownCards.length / cards.length) * 100);
    const isNewBest = topicProgress && knownPercentage > topicProgress.flashcards.bestKnownPercentage;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {knownPercentage >= 80 ? "🎉" : knownPercentage >= 50 ? "👍" : "💪"}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Session Complete!
          </h2>
          
          {isNewBest && (
            <div className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <span>🏆</span> New Personal Best!
            </div>
          )}
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You&apos;ve reviewed all {cards.length} cards in {topic.name}
          </p>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {knownCards.length}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                Knew it
              </div>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {unknownCards.length}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Still learning
              </div>
            </div>
          </div>

          {/* Progress ring */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${knownPercentage * 3.52} 352`}
                className="text-emerald-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {knownPercentage}%
              </span>
            </div>
          </div>

          {/* Previous best */}
          {topicProgress && topicProgress.flashcards.sessionsCompleted > 1 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Previous best: {topicProgress.flashcards.bestKnownPercentage}% • 
              Sessions: {topicProgress.flashcards.sessionsCompleted}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            {unknownCards.length > 0 && (
              <button
                onClick={reviewUnknown}
                className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
              >
                Review {unknownCards.length} Cards Again
              </button>
            )}
            <button
              onClick={shuffleCards}
              className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
            >
              Shuffle & Restart
            </button>
            <button
              onClick={restartGame}
              className="w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="flex flex-col min-h-[70vh]">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <button
            onClick={shuffleCards}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Shuffle
          </button>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center mb-8">
        {currentCard && (
          <Flashcard
            front={currentCard.front}
            back={currentCard.back}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-4">
        {isFlipped ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleStillLearning}
              className="py-4 px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <span>🤔</span>
              <span className="hidden sm:inline">Still Learning</span>
              <span className="sm:hidden">Learning</span>
            </button>
            <button
              onClick={handleKnew}
              className="py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <span>✓</span>
              <span className="hidden sm:inline">I Knew It!</span>
              <span className="sm:hidden">Knew It</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleFlip}
            className="w-full py-4 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors text-lg"
          >
            <span className="hidden sm:inline">Tap Card or Click to Reveal Answer</span>
            <span className="sm:hidden">Tap to Reveal</span>
          </button>
        )}

        {/* Score tracker */}
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-gray-600 dark:text-gray-400">
              Knew: {knownCards.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-gray-600 dark:text-gray-400">
              Learning: {unknownCards.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
