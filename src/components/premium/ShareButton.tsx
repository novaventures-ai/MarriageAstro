/**
 * ShareButton Component
 * Uses Web Share API on mobile, falls back to copy link + WhatsApp on desktop
 */

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
  /** Optional custom URL; defaults to current page */
  url?: string;
  className?: string;
  iconOnly?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text,
  url,
  className = '',
  iconOnly = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  const handleShare = async () => {
    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // User cancelled or not supported — fall through to menu
      }
    }
    // Desktop fallback: show menu
    setShowMenu(!showMenu);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = `${text}\n${shareUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const handleWhatsApp = () => {
    const whatsappText = encodeURIComponent(`${text}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        title="Share"
      >
        <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        {!iconOnly && <span className="ml-1.5 text-sm text-gray-600 dark:text-gray-400">Share</span>}
      </button>

      {/* Desktop fallback menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              Share on WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
};
