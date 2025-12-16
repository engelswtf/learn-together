"use client";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

// Calculate text size based on content length
function getTextSizeClass(text: string): string {
  const length = text.length;
  if (length < 50) return "text-xl md:text-2xl";
  if (length < 100) return "text-lg md:text-xl";
  if (length < 200) return "text-base md:text-lg";
  return "text-sm md:text-base";
}

export function Flashcard({ front, back, isFlipped, onFlip }: FlashcardProps) {
  const frontTextSize = getTextSizeClass(front);
  const backTextSize = getTextSizeClass(back);

  return (
    <div
      className="w-full max-w-md mx-auto perspective-1000 cursor-pointer"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onFlip();
        }
      }}
      aria-label={isFlipped ? "Card showing answer, click to flip" : "Card showing question, click to flip"}
    >
      <div
        className={`
          relative w-full min-h-[280px] md:min-h-[320px] transition-transform duration-500 transform-style-preserve-3d
          ${isFlipped ? "rotate-y-180" : ""}
        `}
      >
        {/* Front of card */}
        <div
          className={`
            absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center
            bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl
            border-4 border-white/20 overflow-hidden
          `}
        >
          <span className="text-sm font-medium uppercase tracking-wider mb-3 opacity-80">
            Question
          </span>
          <div className="flex-1 flex items-center justify-center w-full overflow-y-auto">
            <p className={`${frontTextSize} font-bold text-center leading-relaxed px-2`}>
              {front}
            </p>
          </div>
          <span className="mt-3 text-sm opacity-60">
            Tap to flip
          </span>
        </div>

        {/* Back of card */}
        <div
          className={`
            absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col items-center justify-center
            bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl rotate-y-180
            border-4 border-white/20 overflow-hidden
          `}
        >
          <span className="text-sm font-medium uppercase tracking-wider mb-3 opacity-80">
            Answer
          </span>
          <div className="flex-1 flex items-center justify-center w-full overflow-y-auto">
            <p className={`${backTextSize} font-bold text-center leading-relaxed px-2`}>
              {back}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
