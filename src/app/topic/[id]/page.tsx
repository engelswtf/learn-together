import Link from "next/link";
import { notFound } from "next/navigation";
import { topics } from "@/data/topics";
import { TopicProgressCard } from "@/components/ProgressStats";
import { WeakCardsButton } from "@/components/WeakCardsButton";

interface TopicPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Game mode info for the cards
const gameModeCards = [
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Study with flip cards",
    icon: "🃏",
    playerType: "Solo",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "quiz",
    name: "Quiz",
    description: "Test your knowledge",
    icon: "❓",
    playerType: "Solo",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "duel",
    name: "Duel",
    description: "Turn-based battle",
    icon: "⚔️",
    playerType: "Multiplayer",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "race",
    name: "Race",
    description: "First to answer wins",
    icon: "🏁",
    playerType: "Multiplayer",
    gradient: "from-pink-500 to-rose-600",
  },
];

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = await params;
  const topic = topics.find((t) => t.id === id);

  if (!topic) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <header className="pt-8 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
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
            Back to Home
          </Link>

          {/* Topic Info Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            {/* Colored accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${topic.color}`} />

            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className={`flex-shrink-0 w-20 h-20 rounded-2xl ${topic.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center`}>
                <span className="text-5xl" role="img" aria-label={topic.name}>
                  {topic.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {topic.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {topic.description}
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  📚 {topic.cardCount} cards
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress & Weak Cards Section */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <TopicProgressCard topicId={topic.id} />
          <WeakCardsButton topicId={topic.id} />
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎮</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose Game Mode
            </h2>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameModeCards.map((mode) => (
              <Link 
                key={mode.id}
                href={`/topic/${topic.id}/${mode.id}`}
              >
                <div className={`
                  group relative overflow-hidden rounded-2xl p-6 
                  bg-gradient-to-br ${mode.gradient}
                  shadow-lg hover:shadow-2xl 
                  transition-all duration-300 hover:-translate-y-1 
                  cursor-pointer h-full min-h-[160px]
                  flex flex-col justify-between
                `}>
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-3">
                      <span 
                        className="text-4xl drop-shadow-lg" 
                        role="img" 
                        aria-label={mode.name}
                      >
                        {mode.icon}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">
                      {mode.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/90 text-sm">
                      {mode.description}
                    </p>
                  </div>
                  
                  {/* Footer */}
                  <div className="relative z-10 flex items-center justify-between mt-4">
                    {/* Player type badge */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                      {mode.playerType === "Solo" ? "👤" : "👥"} {mode.playerType}
                    </span>
                    
                    {/* Arrow indicator */}
                    <span className="text-white/80 group-hover:text-white transition-colors">
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
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with ❤️ for learners everywhere</p>
        </div>
      </footer>
    </main>
  );
}

// Generate static params for all topics
export function generateStaticParams() {
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TopicPageProps) {
  const { id } = await params;
  const topic = topics.find((t) => t.id === id);

  if (!topic) {
    return {
      title: "Topic Not Found | LearnTogether",
    };
  }

  return {
    title: `${topic.name} | LearnTogether`,
    description: topic.description,
  };
}
