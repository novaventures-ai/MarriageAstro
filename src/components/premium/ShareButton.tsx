/**
 * ShareButton Component
 * Uses Web Share API on mobile, falls back to platform menu on desktop.
 * Supports dynamic share text from report data (WhatsApp, Twitter/X, copy).
 */

import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Twitter, Download } from 'lucide-react';
import { ReportShareData, OgImageParams, buildShareText, buildWhatsAppText, buildTwitterText, buildStoryImageUrl } from '../../lib/shareUtils';

interface ShareButtonProps {
  title: string;
  text: string;
  /** Structured report data for richer platform-specific text */
  reportData?: ReportShareData;
  /** OG image params used to build a Story Card download */
  ogParams?: OgImageParams;
  /** Optional custom URL; defaults to current page */
  url?: string;
  className?: string;
  iconOnly?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text,
  reportData,
  ogParams,
  url,
  className = '',
  iconOnly = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadingStory, setDownloadingStory] = useState(false);

  const shareUrl = url || window.location.href;
  const siteUrl = 'https://marriage-astro.vercel.app';
  const displayUrl = shareUrl.startsWith('http') ? shareUrl : siteUrl;

  // Platform-specific text
  const whatsappText = reportData ? buildWhatsAppText(reportData) : `${text}\n${displayUrl}`;
  const twitterText = reportData ? buildTwitterText(reportData) : text;
  const copyText = reportData ? `${buildShareText(reportData)}\n${displayUrl}` : `${text}\n${displayUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: reportData ? buildShareText(reportData) : text, url: displayUrl });
        return;
      } catch {
        // User cancelled or not supported
      }
    }
    setShowMenu(!showMenu);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = copyText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setShowMenu(false);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
    setShowMenu(false);
  };

  const handleTwitter = () => {
    const tweet = `${twitterText} ${displayUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
    setShowMenu(false);
  };

  const handleDownloadStory = async () => {
    if (!ogParams) return;
    setDownloadingStory(true);
    setShowMenu(false);
    try {
      const storyUrl = buildStoryImageUrl(ogParams);
      const res = await fetch(storyUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${ogParams.nameA}-${ogParams.nameB}-kundali-story.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // fallback: open in new tab
      if (ogParams) window.open(buildStoryImageUrl(ogParams), '_blank');
    } finally {
      setDownloadingStory(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        title="Share"
      >
        {copied
          ? <Check className="w-5 h-5 text-green-500" />
          : <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
        {!iconOnly && (
          <span className="ml-1.5 text-sm text-gray-600 dark:text-gray-400">
            {copied ? 'Copied!' : 'Share'}
          </span>
        )}
      </button>

      {/* Desktop fallback menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy with Score'}
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              Share on WhatsApp
            </button>
            <button
              onClick={handleTwitter}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Twitter className="w-4 h-4 text-sky-500" />
              Share on X / Twitter
            </button>
            {ogParams && (
              <button
                onClick={handleDownloadStory}
                disabled={downloadingStory}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-pink-500" />
                {downloadingStory ? 'Downloading…' : 'Download Story Card'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
