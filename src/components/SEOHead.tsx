/**
 * SEO Head Component
 * Provides per-page meta tags using react-helmet-async
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://astro-marriage.vercel.app';
const SITE_NAME = 'Astro Marriage';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Free Kundali Matching & Marriage Prediction powered by Vedic Astrology. Ashtakoot Milan, marriage timing, spouse characteristics & personalized remedies.',
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Free Kundali Matching & Vedic Marriage Compatibility`;
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
