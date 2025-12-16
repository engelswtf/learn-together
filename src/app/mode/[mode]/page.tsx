import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { topics } from "@/data/topics";

interface ModePageProps {
  params: Promise<{
    mode: string;
  }>;
}

// Mode-specific styling
const modeStyles: Record<string, { gradient: string; bgGradient: string; icon: string; name: string; description: string }> = {
  flashcards: {
    gradient: "from-indigo-500 to-purple-600",
    bgGradient: "from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30",
    icon: "🃏",
    name: "Flashcards",
    description: "Study with flip cards at your own pace",
  },
  quiz: {
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    icon: "❓",
    name: "Quiz",
    description: "Test your knowledge with multiple choice questions",
  },
};

function TopicCard({ 
  topic, 
  mode, 
  modeGradient 
}: { 
  topic: typeof topics[0]; 
  mode: string;
  modeGradient: string;
}) {
  return (
    <Link href={`/topic/${topic.id}/${mode}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        {/* Colored accent bar with mode gradient */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${modeGradient}`} />
        
        {/* Icon */}
        <div className="mb-4">
          <span className="text-5xl" role="img" aria-label={topic.name}>
            {topic.icon}
          </span>
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {topic.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {topic.description}
        </p>
        
        {/* Card count badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
            {mode === "quiz" ? "❓" : "📚"} {topic.cardCount} {mode === "quiz" ? "questions" : "cards"}
          </span>
          
          {/* Arrow indicator */}
          <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
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
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ModePage({ params }: ModePageProps) {
  const { mode } = await params;
  
  // Redirect multiplayer modes to the new /play/ routes
  if (mode === "duel") {
    redirect("/play/duel");
  }
  if (mode === "race") {
    redirect("/play/race");
  }
  
  // Validate mode - only flashcards and quiz now
  const validModes = ["flashcards", "quiz"];
  if (!validModes.includes(mode)) {
    notFound();
  }
  
  const modeInfo = modeStyles[mode];

  return (
    <main className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950`}>
      {/* Header Section */}
      <header className="pt-8 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
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
            Back to Game Modes
          </Link>

          {/* Mode Info Card */}
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${modeInfo.bgGradient} p-8 shadow-lg border border-gray-100 dark:border-gray-700`}>
            {/* Colored accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${modeInfo.gradient}`} />

            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${modeInfo.gradient} flex items-center justify-center shadow-lg`}>
                <span className="text-5xl drop-shadow-lg" role="img" aria-label={modeInfo.name}>
                  {modeInfo.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {modeInfo.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {modeInfo.description}
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                  👤 Solo
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Topics Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose a Topic
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {topics.length} topics available
            </span>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                mode={mode}
                modeGradient={modeInfo.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with love for learners everywhere</p>
        </div>
      </footer>
    </main>
  );
}

// Generate static params for solo modes only
export function generateStaticParams() {
  return [
    { mode: "flashcards" },
    { mode: "quiz" },
  ];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ModePageProps) {
  const { mode } = await params;
  const modeInfo = modeStyles[mode];

  if (!modeInfo) {
    return {
      title: "Mode Not Found | LearnTogether",
    };
  }

  return {
    title: `${modeInfo.name} - Choose Topic | LearnTogether`,
    description: modeInfo.description,
  };
}
