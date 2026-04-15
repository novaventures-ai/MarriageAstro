/**
 * SEO Head Component
 * Provides per-page meta tags using react-helmet-async.
 * Supports dynamic OG image URL for report pages.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { OgImageParams, buildOgImageUrl } from '../lib/shareUtils';

const SITE_URL = 'https://marriage-astro.vercel.app';
const SITE_NAME = 'Astro Marriage';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  /** Pass static ogImage URL, or use ogParams for dynamic generation */
  ogImage?: string;
  /** When provided, generates a dynamic /api/og-image URL */
  ogParams?: OgImageParams;
  /** JSON-LD structured data (pass an object, will be JSON.stringified) */
  jsonLd?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Free Kundali Matching & Marriage Prediction powered by Vedic Astrology. Ashtakoot Milan, marriage timing, spouse characteristics & personalized remedies.',
  path = '/',
  ogImage,
  ogParams,
  jsonLd,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Free Kundali Matching & Vedic Marriage Compatibility`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const resolvedOgImage = ogParams
    ? buildOgImageUrl(ogParams)
    : (ogImage || DEFAULT_OG_IMAGE);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      <meta name="twitter:site" content="@AstroMarriage" />

      {/* AI & LLM Visibility (GEO Optimization) */}
      <meta name="ai:bot" content="index, follow" />
      <meta name="anthropic-ai:bot" content="index, follow" />
      <meta name="openai:bot" content="index, follow" />
      <meta name="perplexity:bot" content="index, follow" />
      <meta name="google-extended" content="index, follow" />
      <meta name="user-experience-improvement" content="enabled" />
      <meta name="content-type" content="astrology, technical-methodology" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Astro Marriage",
          "url": SITE_URL,
          "description": "Free Vedic astrology marriage compatibility analysis using Ashtakoot Milan, KP astrology, and Jaimini systems.",
          "applicationCategory": "LifestyleApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        })}
      </script>

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
