"use client";

import { useCallback } from "react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  showResult: boolean;
  onSelect: (index: number) => void;
}

const optionLabels = ["A", "B", "C", "D"];

export function QuizQuestion({
  question,
  options,
  selectedIndex,
  correctIndex,
  showResult,
  onSelect,
}: QuizQuestionProps) {
  const getOptionStyles = useCallback(
    (index: number) => {
      const baseStyles =
        "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4 border-2";

      if (showResult) {
        // Show results state
        if (index === correctIndex) {
          return `${baseStyles} bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200`;
        }
        if (index === selectedIndex && index !== correctIndex) {
          return `${baseStyles} bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200`;
        }
        return `${baseStyles} bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 opacity-60`;
      }

      // Selection state
      if (index === selectedIndex) {
        return `${baseStyles} bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 text-indigo-800 dark:text-indigo-200`;
      }

      // Default state
      return `${baseStyles} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer`;
    },
    [showResult, selectedIndex, correctIndex]
  );

  const getLabelStyles = useCallback(
    (index: number) => {
      const baseStyles =
        "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0";

      if (showResult) {
        if (index === correctIndex) {
          return `${baseStyles} bg-emerald-500 text-white`;
        }
        if (index === selectedIndex && index !== correctIndex) {
          return `${baseStyles} bg-red-500 text-white`;
        }
        return `${baseStyles} bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400`;
      }

      if (index === selectedIndex) {
        return `${baseStyles} bg-indigo-500 text-white`;
      }

      return `${baseStyles} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300`;
    },
    [showResult, selectedIndex, correctIndex]
  );

  const getIcon = useCallback(
    (index: number) => {
      if (!showResult) return null;

      if (index === correctIndex) {
        return (
          <svg
            className="w-6 h-6 text-emerald-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      }

      if (index === selectedIndex && index !== correctIndex) {
        return (
          <svg
            className="w-6 h-6 text-red-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      }

      return null;
    },
    [showResult, selectedIndex, correctIndex]
  );

  return (
    <div className="space-y-6">
      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white text-center">
          {question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && onSelect(index)}
            disabled={showResult}
            className={getOptionStyles(index)}
          >
            <span className={getLabelStyles(index)}>
              {optionLabels[index]}
            </span>
            <span className="flex-1 text-base md:text-lg font-medium">
              {option}
            </span>
            {getIcon(index)}
          </button>
        ))}
      </div>
    </div>
  );
}
