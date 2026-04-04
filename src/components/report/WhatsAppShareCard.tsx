/**
 * WhatsAppShareCard
 * Prominent private-sharing card on the report page.
 * Designed for the women-to-sister/friend sharing loop — not public.
 */

import React, { useState } from 'react';
import { Check, Copy, Lock } from 'lucide-react';
import { ReportShareData, buildWhatsAppText, buildShareText } from '../../lib/shareUtils';

interface WhatsAppShareCardProps {
  data: ReportShareData;
  /** App URL for the share link */
  url?: string;
}

const SITE_URL = 'https://marriage-astro.vercel.app';

function getVerdictStyle(score: number): { label: string; bg: string; text: string; border: string } {
  if (score >= 28) return { label: 'Excellent Match', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800/40' };
  if (score >= 21) return { label: 'Good Match', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800/40' };
  if (score >= 18) return { label: 'Acceptable Match', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/40' };
  return { label: 'Needs Careful Review', bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800/40' };
}

export const WhatsAppShareCard: React.FC<WhatsAppShareCardProps> = ({ data, url }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || SITE_URL;
  const verdict = getVerdictStyle(data.ashtakootScore);
  const waText = buildWhatsAppText({ ...data });
  const copyText = `${buildShareText(data)}\n${shareUrl}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = copyText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`rounded-2xl border p-5 ${verdict.bg} ${verdict.border} transition-colors`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">

        {/* Score + names */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center shadow-sm">
            <span className={`text-2xl font-black leading-none ${verdict.text}`}>{data.ashtakootScore}</span>
            <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">/ 36</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide font-medium">Ashtakoot Score</p>
            <p className={`text-base font-bold truncate ${verdict.text}`}>{verdict.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {data.nameA} &amp; {data.nameB}
              {data.riskLevel && ` · ${data.riskLevel} risk`}
            </p>
          </div>
        </div>

        {/* Share actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95"
          >
            {/* WhatsApp logo inline SVG */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Score Card'}
          </button>
        </div>
      </div>

      {/* Private framing */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-current/10">
        <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          Share privately with family or a trusted friend. Your full report stays on your device — only the score is shared.
        </p>
      </div>
    </div>
  );
};
