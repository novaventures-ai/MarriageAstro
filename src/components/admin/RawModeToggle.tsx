import React from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useUserProfileStore } from '../../store/useUserProfileStore';

/**
 * Admin-only floating toggle to switch between Raw (unfiltered) and
 * Polished (public-safe) view of sensitive widgets.
 * Only renders when isAdmin === true.
 */
export const RawModeToggle: React.FC = () => {
  const isAdmin = useUserProfileStore(s => s.isAdmin);
  const rawMode = useUserProfileStore(s => s.rawMode);
  const setRawMode = useUserProfileStore(s => s.setRawMode);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setRawMode(!rawMode)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl border text-sm font-bold transition-all duration-200 ${
          rawMode
            ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-red-900/40'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-emerald-900/40'
        }`}
        title={rawMode ? 'Switch to Polished (public) view' : 'Switch to Raw (unfiltered) view'}
      >
        <ShieldAlert className="w-4 h-4" />
        <span>ADMIN:</span>
        {rawMode ? (
          <>
            <Eye className="w-4 h-4" />
            <span>RAW MODE</span>
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4" />
            <span>POLISHED</span>
          </>
        )}
      </button>
    </div>
  );
};
