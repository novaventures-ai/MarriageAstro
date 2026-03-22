import React from 'react';
import { Lock } from 'lucide-react';

export const PremiumBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full ${className}`}>
    <Lock className="w-2.5 h-2.5" />
    PRO
  </span>
);
