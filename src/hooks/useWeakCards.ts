"use client";

import { useState, useEffect, useCallback } from "react";

interface WeakCard {
  id: string;
  topicId: string;
  type: "flashcard" | "quiz";
  wrongCount: number;
  lastWrong: string;
}

interface WeakCardsData {
  cards: Record<string, WeakCard>; // key is `${topicId}-${type}-${id}`
}

const STORAGE_KEY = "learn-together-weak-cards";

export function useWeakCards() {
  const [weakCards, setWeakCards] = useState<WeakCardsData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWeakCards(JSON.parse(stored));
      } else {
        setWeakCards({ cards: {} });
      }
    } catch (e) {
      console.error("Failed to load weak cards:", e);
      setWeakCards({ cards: {} });
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (weakCards && isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(weakCards));
      } catch (e) {
        console.error("Failed to save weak cards:", e);
      }
    }
  }, [weakCards, isLoaded]);

  // Record a wrong answer
  const recordWrong = useCallback(
    (topicId: string, cardId: string, type: "flashcard" | "quiz") => {
      const key = `${topicId}-${type}-${cardId}`;
      
      setWeakCards((prev) => {
        if (!prev) return null;
        
        const existing = prev.cards[key];
        
        return {
          cards: {
            ...prev.cards,
            [key]: {
              id: cardId,
              topicId,
              type,
              wrongCount: (existing?.wrongCount || 0) + 1,
              lastWrong: new Date().toISOString(),
            },
          },
        };
      });
    },
    []
  );

  // Record a correct answer (reduces wrong count)
  const recordCorrect = useCallback(
    (topicId: string, cardId: string, type: "flashcard" | "quiz") => {
      const key = `${topicId}-${type}-${cardId}`;
      
      setWeakCards((prev) => {
        if (!prev) return null;
        
        const existing = prev.cards[key];
        if (!existing) return prev;
        
        const newCount = existing.wrongCount - 1;
        
        if (newCount <= 0) {
          // Remove from weak cards
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...rest } = prev.cards;
          return { cards: rest };
        }
        
        return {
          cards: {
            ...prev.cards,
            [key]: {
              ...existing,
              wrongCount: newCount,
            },
          },
        };
      });
    },
    []
  );

  // Get weak cards for a topic
  const getWeakCardsForTopic = useCallback(
    (topicId: string, type?: "flashcard" | "quiz"): WeakCard[] => {
      if (!weakCards) return [];
      
      return Object.values(weakCards.cards).filter(
        (card) => card.topicId === topicId && (!type || card.type === type)
      );
    },
    [weakCards]
  );

  // Get weak card IDs for a topic
  const getWeakCardIds = useCallback(
    (topicId: string, type: "flashcard" | "quiz"): string[] => {
      return getWeakCardsForTopic(topicId, type).map((card) => card.id);
    },
    [getWeakCardsForTopic]
  );

  // Check if a card is weak
  const isWeakCard = useCallback(
    (topicId: string, cardId: string, type: "flashcard" | "quiz"): boolean => {
      if (!weakCards) return false;
      const key = `${topicId}-${type}-${cardId}`;
      return !!weakCards.cards[key];
    },
    [weakCards]
  );

  // Get total weak cards count
  const getTotalWeakCards = useCallback(
    (topicId?: string): number => {
      if (!weakCards) return 0;
      
      if (topicId) {
        return Object.values(weakCards.cards).filter(
          (card) => card.topicId === topicId
        ).length;
      }
      
      return Object.keys(weakCards.cards).length;
    },
    [weakCards]
  );

  // Clear weak cards for a topic
  const clearWeakCards = useCallback(
    (topicId: string, type?: "flashcard" | "quiz") => {
      setWeakCards((prev) => {
        if (!prev) return null;
        
        const filtered = Object.entries(prev.cards).filter(
          ([, card]) => card.topicId !== topicId || (type && card.type !== type)
        );
        
        return { cards: Object.fromEntries(filtered) };
      });
    },
    []
  );

  return {
    isLoaded,
    recordWrong,
    recordCorrect,
    getWeakCardsForTopic,
    getWeakCardIds,
    isWeakCard,
    getTotalWeakCards,
    clearWeakCards,
  };
}
