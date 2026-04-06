import React, { useState } from 'react';
import { UserPlus, MessageCircle, Copy, Check, Share2 } from 'lucide-react';
import { generatePartnerInviteUrl } from '../../lib/shareUtils';

interface PartnerInviteButtonProps {
  userChart: any;
  partnerName?: string;
  className?: string;
}

export const PartnerInviteButton: React.FC<PartnerInviteButtonProps> = ({
  userChart,
  partnerName = 'Partner',
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteUrl = generatePartnerInviteUrl(userChart);
  const inviteText = `Hey! I checked our marriage compatibility on Astro Marriage. Click this link, enter your birth details, and let's compare! 🔮\n\n${inviteUrl}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(inviteText)}`, '_blank');
    setShowMenu(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invite Partner to Astro Marriage',
          text: `Compare our charts on Astro Marriage!`,
          url: inviteUrl,
        });
        return;
      } catch (err) {
        // Fallback to menu
      }
    }
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all font-medium text-sm ${className}`}
      >
        <UserPlus className="w-4 h-4" />
        <span className="hidden sm:inline">Invite Partner</span>
        <span className="sm:hidden">Invite</span>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Share Invite via</p>
            </div>
            
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-medium">WhatsApp</span>
            </button>

            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center">
                {copied ? <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <Copy className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </div>
              <span className="font-medium">{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>

            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                Partner gets a special welcome & enters birth details to unlock your shared report.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
