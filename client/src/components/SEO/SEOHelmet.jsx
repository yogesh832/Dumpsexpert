import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * SEOHelmet component for managing SEO metadata using react-helmet-async
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.ogTitle - Open Graph title
 * @param {string} props.ogDescription - Open Graph description
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.twitterTitle - Twitter title
 * @param {string} props.twitterDescription - Twitter description
 * @param {string} props.twitterImage - Twitter image URL
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {string} props.schema - JSON-LD schema
 */
const SEOHelmet = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  schema
}) => {
  // Parse schema if it's a string
  let parsedSchema = null;
  if (schema) {
    try {
      parsedSchema = typeof schema === 'string' ? JSON.parse(schema) : schema;
    } catch (error) {
      console.error('Invalid JSON-LD schema:', error);
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph Meta Tags */}
      {title && <meta property="og:title" content={ogTitle || title} />}
      {description && <meta property="og:description" content={ogDescription || description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={twitterTitle || ogTitle || title} />}
      {description && <meta name="twitter:description" content={twitterDescription || ogDescription || description} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage || ogImage} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* JSON-LD Schema */}
      {parsedSchema && (
        <script type="application/ld+json">
          {JSON.stringify(parsedSchema)}
        </script>
      )}
    </Helmet>
  );
};

SEOHelmet.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
  ogImage: PropTypes.string,
  twitterTitle: PropTypes.string,
  twitterDescription: PropTypes.string,
  twitterImage: PropTypes.string,
  canonicalUrl: PropTypes.string,
  schema: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default SEOHelmet;