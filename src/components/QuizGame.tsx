"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { QuizQuestion as QuizQuestionType, Topic } from "@/types";
import { QuizQuestion } from "./QuizQuestion";
import { useProgress } from "@/hooks/useProgress";
import { useWeakCards } from "@/hooks/useWeakCards";

interface QuizGameProps {
  questions: QuizQuestionType[];
  topic: Topic;
}

interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
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

export function QuizGame({ questions, topic }: QuizGameProps) {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionType[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [showReview, setShowReview] = useState(false);
  const [sessionCompleteSaved, setSessionCompleteSaved] = useState(false);

  // Track questions already recorded in this session to avoid double-counting on restart
  const recordedQuestionsRef = useRef<Set<string>>(new Set());

  const { recordQuizAnswer, recordQuizSessionComplete, getTopicProgress, isLoaded } = useProgress();
  const { recordWrong, recordCorrect } = useWeakCards();
  const topicProgress = isLoaded ? getTopicProgress(topic.id) : null;

  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex) / quizQuestions.length) * 100;
  const isLastQuestion = currentIndex === quizQuestions.length - 1;

  // Save session completion stats when game finishes (for best percentage and quiz attempts count)
  useEffect(() => {
    if (gameState === "finished" && !sessionCompleteSaved && quizQuestions.length > 0) {
      recordQuizSessionComplete(topic.id, quizQuestions.length, score);
      setSessionCompleteSaved(true);
    }
  }, [gameState, sessionCompleteSaved, quizQuestions.length, score, topic.id, recordQuizSessionComplete]);

  const handleSelect = useCallback((index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  }, [showResult]);

  const handleCheckAnswer = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    
    setShowResult(true);
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      // Record as correct for weak cards tracking
      recordCorrect(topic.id, currentQuestion.id, "quiz");
    } else {
      // Record as wrong for weak cards tracking
      recordWrong(topic.id, currentQuestion.id, "quiz");
    }

    // Save progress incrementally (only if not already recorded in this session)
    if (!recordedQuestionsRef.current.has(currentQuestion.id)) {
      recordQuizAnswer(topic.id, isCorrect);
      recordedQuestionsRef.current.add(currentQuestion.id);
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: selectedAnswer,
        correctIndex: currentQuestion.correctIndex,
        isCorrect,
      },
    ]);
  }, [selectedAnswer, currentQuestion, recordCorrect, recordWrong, recordQuizAnswer, topic.id]);

  const handleNextQuestion = useCallback(() => {
    if (isLastQuestion) {
      setGameState("finished");
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [isLastQuestion]);

  const shuffleQuestions = useCallback(() => {
    const shuffled = shuffleArray(questions);
    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setGameState("playing");
    setShowReview(false);
    setSessionCompleteSaved(false);
    // Reset recorded questions for new session
    recordedQuestionsRef.current = new Set();
  }, [questions]);

  const restartQuiz = useCallback(() => {
    setQuizQuestions(questions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setGameState("playing");
    setShowReview(false);
    setSessionCompleteSaved(false);
    // Reset recorded questions for new session
    recordedQuestionsRef.current = new Set();
  }, [questions]);

  const reviewIncorrect = useCallback(() => {
    const incorrectIds = answers
      .filter((a) => !a.isCorrect)
      .map((a) => a.questionId);
    const incorrectQuestions = questions.filter((q) =>
      incorrectIds.includes(q.id)
    );
    
    if (incorrectQuestions.length > 0) {
      setQuizQuestions(incorrectQuestions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
      setAnswers([]);
      setGameState("playing");
      setShowReview(false);
      setSessionCompleteSaved(false);
      // Reset recorded questions for review session
      recordedQuestionsRef.current = new Set();
    }
  }, [questions, answers]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      // Number keys for option selection
      if (!showResult && ["1", "2", "3", "4"].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < quizQuestions[currentIndex]?.options.length) {
          handleSelect(index);
        }
      }

      // Enter to check answer or move to next
      if (e.key === "Enter") {
        e.preventDefault();
        if (showResult) {
          handleNextQuestion();
        } else if (selectedAnswer !== null) {
          handleCheckAnswer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, showResult, selectedAnswer, currentIndex, quizQuestions, handleSelect, handleCheckAnswer, handleNextQuestion]);

  // Review screen within finished state
  if (showReview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Review Answers
          </h2>
          <button
            onClick={() => setShowReview(false)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            Back to Results
          </button>
        </div>

        <div className="space-y-4">
          {quizQuestions.map((question, qIndex) => {
            const answer = answers[qIndex];
            return (
              <div
                key={question.id}
                className={`p-4 rounded-xl border-2 ${
                  answer?.isCorrect
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
                      answer?.isCorrect ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    {qIndex + 1}
                  </span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {question.question}
                  </p>
                </div>
                
                <div className="ml-11 space-y-1 text-sm">
                  <p className="text-emerald-700 dark:text-emerald-300">
                    <span className="font-medium">Correct:</span>{" "}
                    {question.options[question.correctIndex]}
                  </p>
                  {!answer?.isCorrect && (
                    <p className="text-red-700 dark:text-red-300">
                      <span className="font-medium">Your answer:</span>{" "}
                      {question.options[answer?.selectedIndex ?? 0]}
                    </p>
                  )}
                  {question.explanation && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Finished state
  if (gameState === "finished") {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const incorrectCount = quizQuestions.length - score;
    const isNewBest = topicProgress && percentage > topicProgress.quiz.bestPercentage;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎯" : percentage >= 40 ? "📚" : "💪"}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Complete!
          </h2>

          {isNewBest && (
            <div className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <span>🏆</span> New Personal Best!
            </div>
          )}

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You&apos;ve completed the {topic.name} quiz
          </p>

          {/* Score Display */}
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {score}/{quizQuestions.length}
            </div>
            <div className="text-indigo-700 dark:text-indigo-300 font-medium">
              {percentage}% Correct
            </div>
          </div>

          {/* Results breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {score}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                Correct
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {incorrectCount}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                Incorrect
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
                strokeDasharray={`${percentage * 3.52} 352`}
                className="text-indigo-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Previous best */}
          {topicProgress && topicProgress.quiz.totalAttempts > 1 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Previous best: {topicProgress.quiz.bestPercentage}% • 
              Attempts: {topicProgress.quiz.totalAttempts}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowReview(true)}
              className="w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
            >
              Review All Answers
            </button>
            {incorrectCount > 0 && (
              <button
                onClick={reviewIncorrect}
                className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
              >
                Practice {incorrectCount} Incorrect
              </button>
            )}
            <button
              onClick={shuffleQuestions}
              className="w-full py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
            >
              Shuffle & Try Again
            </button>
            <button
              onClick={restartQuiz}
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
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentIndex + 1} of {quizQuestions.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Score: {score}/{currentIndex + (showResult ? 1 : 0)}
            </span>
            <button
              onClick={shuffleQuestions}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Shuffle
            </button>
          </div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 mb-6">
        {currentQuestion && (
          <QuizQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedIndex={selectedAnswer}
            correctIndex={currentQuestion.correctIndex}
            showResult={showResult}
            onSelect={handleSelect}
          />
        )}
      </div>

      {/* Explanation (shown after checking) */}
      {showResult && currentQuestion?.explanation && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Explanation
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-4">
        {showResult ? (
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
          >
            {isLastQuestion ? (
              <>
                <span>See Results</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>Next Question</span>
                <svg
                  className="w-5 h-5"
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
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === null}
            className={`w-full py-4 px-6 font-semibold rounded-xl transition-colors text-lg ${
              selectedAnswer === null
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            Check Answer
          </button>
        )}
      </div>
    </div>
  );
}
