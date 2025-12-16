import Link from "next/link";
import { Topic } from "@/types";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topic/${topic.id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        {/* Colored accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${topic.color}`} />
        
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
            {topic.cardCount} cards
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
