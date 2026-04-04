/**
 * MobileNavStrip
 * Sticky bottom strip for mobile report navigation.
 * - Left/right arrows to move between CosmicNavigator themes
 * - Current theme label in the center
 * - Floating back-to-top button appears after scrolling 400px
 * Desktop: hidden (CosmicNavigator tabs handle navigation)
 */

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { ThemeId } from '../widgets/CosmicNavigator';

const THEMES: { id: ThemeId; label: string; emoji: string }[] = [
  { id: 'match',     label: 'Match',     emoji: '🔮' },
  { id: 'partner',   label: 'Partner',   emoji: '👤' },
  { id: 'risks',     label: 'Risks',     emoji: '⚡' },
  { id: 'chemistry', label: 'Chemistry', emoji: '💞' },
  { id: 'timing',    label: 'Timing',    emoji: '⏳' },
];

interface MobileNavStripProps {
  activeTheme: ThemeId;
  onSelectTheme: (id: ThemeId) => void;
}

export const MobileNavStrip: React.FC<MobileNavStripProps> = ({ activeTheme, onSelectTheme }) => {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentIdx = THEMES.findIndex(t => t.id === activeTheme);
  const current = THEMES[currentIdx];
  const canPrev = currentIdx > 0;
  const canNext = currentIdx < THEMES.length - 1;

  const goPrev = () => { if (canPrev) { onSelectTheme(THEMES[currentIdx - 1].id); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const goNext = () => { if (canNext) { onSelectTheme(THEMES[currentIdx + 1].id); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Sticky bottom strip — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between gap-2 safe-area-b">
          {/* Prev */}
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            {canPrev && <span className="text-xs">{THEMES[currentIdx - 1].emoji}</span>}
          </button>

          {/* Current section — tap to cycle */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Section</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base">{current.emoji}</span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{current.label}</span>
              <span className="text-[10px] text-gray-400">{currentIdx + 1}/{THEMES.length}</span>
            </div>
            {/* Dot indicators */}
            <div className="flex gap-1 mt-0.5">
              {THEMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { onSelectTheme(THEMES[i].id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`rounded-full transition-all ${i === currentIdx ? 'w-4 h-1.5 bg-indigo-500' : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            disabled={!canNext}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
          >
            {canNext && <span className="text-xs">{THEMES[currentIdx + 1].emoji}</span>}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating back-to-top — mobile only, appears after scroll */}
      {showBackTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-20 right-4 z-40 sm:hidden w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};
