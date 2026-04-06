/**
 * JargonTooltip — inline ? icon that shows a plain-English explanation
 * of Vedic astrology terms for non-astrology users.
 *
 * Usage: <JargonTooltip term="Ashtakoot" />
 *        <JargonTooltip term="Nadi Koot" className="ml-1" />
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';

const JARGON: Record<string, string> = {
  'Ashtakoot': '8-category compatibility scoring system (max 36 points) used in Vedic astrology to assess marriage compatibility',
  'Gun Milan': '8-category compatibility scoring system (max 36 points) used in Vedic astrology — same as Ashtakoot',
  'Guna Milan': '8-category compatibility scoring system (max 36 points) used in Vedic astrology — same as Ashtakoot',
  'Navamsa': 'The marriage soul chart (D9) — reveals the true nature, deep character, and spiritual compatibility of both partners in marriage',
  'D9': 'The marriage soul chart — reveals the true nature and spiritual compatibility of both partners',
  'D9 Navamsa': 'The marriage soul chart — reveals the true nature and spiritual compatibility of both partners in marriage',
  'KP': 'Krishnamurti Paddhati — an advanced Vedic astrology system that gives highly precise timing and event predictions',
  'KP Promise': 'Whether the 7th house (marriage house) of the chart promises marriage — analyzed using the KP advanced timing system',
  'Jaimini': 'An ancient Vedic astrology system focused on soul purpose, karma, and life destiny — complements the standard Parashari system',
  'Chara Karaka': 'Soul-purpose planet — each planet in Jaimini astrology represents a specific life role (self, spouse, mother, etc.)',
  'Darakaraka': 'The planet that represents your future spouse in Jaimini astrology — its sign and house reveal your partner\'s character',
  'Nadi Koot': 'Genetic compatibility category — checks constitutional compatibility at a biological level; Nadi dosha indicates potential health risks',
  'Nadi Dosha': 'Genetic incompatibility warning — both partners share the same Nadi (energy channel), which can indicate health and fertility concerns',
  'Nadi': 'One of the 8 compatibility categories — checks genetic and constitutional compatibility; the most important koot for health',
  'Mangal Dosha': 'Mars energy imbalance — when Mars sits in certain houses it can create intensity, conflict, or delays in marriage; cancelled when both partners have it',
  'Manglik': 'Having Mars in a position that creates Mangal Dosha — affects marriage timing and energy dynamics',
  'D7 Saptamsa': 'The children chart — a special divisional chart that reveals fertility, children\'s health, and family legacy potential',
  'Saptamsa': 'The children chart (D7) — a special divisional chart that reveals fertility and family legacy potential',
  'Bhakoot': 'Financial and health compatibility category in Ashtakoot — checks whether the moon sign relationship supports wealth and well-being',
  'Bhakoot Dosha': 'Financial friction warning — the moon sign combination can create challenges in wealth accumulation and physical health',
  'Gana': 'Temperament compatibility — classifies each person as Divine (Deva), Human (Manushya), or Primal (Rakshasa) to check nature compatibility',
  'Vashya': 'Influence and control compatibility — checks how much natural pull and influence each partner has over the other',
  'Vashya Koot': 'Influence compatibility category — measures the natural magnetic pull and social influence between partners',
  'Yoni': 'Physical/sexual compatibility category — each of 27 birth stars maps to one of 14 animal symbols; matching determines physical harmony',
  'Tara': 'Destiny and fortune compatibility — checks whether the birth stars are aligned for a fortunate and long-lasting marriage',
  'Varna': 'Social/spiritual temperament category — the most basic of the 8 compatibility factors',
  'Upapada Lagna': 'Marriage longevity indicator — a special sensitive point in the chart that shows the strength and durability of the marriage bond',
  'Dasha': 'Planetary period — the Vimshottari Dasha system divides your life into periods ruled by different planets, each activating different life themes',
  'Vimshottari': '120-year planetary period cycle — divides life into periods ruled by 9 planets; used to time marriage, career, and major life events',
  'Chara Dasha': 'Jaimini\'s sign-based period system — an alternative to Vimshottari; particularly accurate for marriage and relationship timing',
  'Nakshatra': 'Lunar mansion — the sky is divided into 27 sections; your moon\'s position in a Nakshatra shapes your emotional nature and compatibility',
  'Divisional Chart': 'Zoomed-in chart — a special chart derived from the birth chart by dividing each sign; reveals details about specific life areas',
  'Synastry': 'Relationship overlay — comparing two birth charts to find karmic connections, soulmate indicators, and energy dynamics between people',
  'Graha Maitri': 'Planetary friendship compatibility — checks whether your moon sign lords are friends, neutral, or enemies; affects mental compatibility',
};

interface JargonTooltipProps {
  term: string;
  className?: string;
}

export const JargonTooltip: React.FC<JargonTooltipProps> = ({ term, className = '' }) => {
  const explanation = JARGON[term];
  if (!explanation) return null;

  return (
    <span className={`relative inline-flex items-center group ${className}`}>
      <HelpCircle className="w-3 h-3 text-indigo-400 dark:text-indigo-500 cursor-help flex-shrink-0" />
      <span className="absolute z-50 invisible group-hover:visible bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[calc(100vw-2rem)] bg-gray-900 dark:bg-gray-800 text-white text-[11px] leading-relaxed rounded-lg px-3 py-2 shadow-xl border border-gray-700 pointer-events-none">
        <span className="font-semibold text-indigo-300">{term}:</span> {explanation}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
      </span>
    </span>
  );
};

/**
 * JargonTerm — wraps a jargon term with an inline tooltip
 * Renders the term text + a ? icon right after it
 *
 * Usage: <JargonTerm term="Ashtakoot" />
 *        <JargonTerm term="Nadi Koot">Nadi Koot</JargonTerm>
 */
export const JargonTerm: React.FC<{ term: string; children?: React.ReactNode; className?: string }> = ({
  term,
  children,
  className = '',
}) => (
  <span className={`inline-flex items-center gap-0.5 ${className}`}>
    <span>{children ?? term}</span>
    <JargonTooltip term={term} />
  </span>
);
