import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEOHead Component for managing SEO metadata
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {string} props.ogTitle - Open Graph title
 * @param {string} props.ogDescription - Open Graph description
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogUrl - Open Graph URL
 * @param {string} props.twitterTitle - Twitter title
 * @param {string} props.twitterDescription - Twitter description
 * @param {string} props.twitterImage - Twitter image URL
 * @param {string} props.jsonLd - JSON-LD schema markup as a string
 */
const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
  jsonLd
}) => {
  // Default site name to append to titles
  const siteName = 'DumpsExpert';
  
  // Use provided values or fallback to defaults
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || 'DumpsExpert - Your trusted source for exam preparation materials';
  const metaKeywords = keywords || 'exam preparation, certification, study materials';
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={metaKeywords} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={ogTitle || pageTitle} />
      <meta property="og:description" content={ogDescription || metaDescription} />
      <meta property="og:type" content="website" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || pageTitle} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || metaDescription} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      
      {/* JSON-LD Schema Markup */}
      {jsonLd && (
        <script type="application/ld+json">
          {jsonLd}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;