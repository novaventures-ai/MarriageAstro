import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AISummaryBoxProps {
  title: string;
  definition: string;
  points: string[];
  className?: string;
}

/**
 * AISummaryBox Component
 * Purpose: Generative Engine Optimization (GEO)
 * Provides AI search engines with structured, definitive content for "Answer Box" results.
 */
export const AISummaryBox: React.FC<AISummaryBoxProps> = ({ 
  title, 
  definition, 
  points, 
  className = "" 
}) => {
  return (
    <aside 
      id="ai-key-takeaways"
      className={`relative group overflow-hidden rounded-2xl border border-indigo-200/50 dark:border-indigo-800/30 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 p-6 mb-10 transition-all hover:shadow-lg hover:shadow-indigo-500/5 ${className}`}
    >
      {/* Decorative pulse element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
      
      <div className="relative flex items-start gap-4">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        
        <div className="flex-1 ai-takeaway-content">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            AI Key Takeaways: {title}
          </h3>
          
          <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed mb-4">
            {definition}
          </p>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {points.map((point, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
