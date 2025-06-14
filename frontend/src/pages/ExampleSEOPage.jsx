import React from 'react';
import { useSEO } from '../context/SEOContext';
import SEOHead from '../components/SEO/SEOHead';

/**
 * Example page demonstrating SEO implementation
 */
const ExampleSEOPage = () => {
  // Get SEO data from context
  const { getPageMeta, generateSchema } = useSEO();
  
  // Get meta information for this page (assuming 'about' page as an example)
  const pageMeta = getPageMeta('about');
  
  // Custom data for schema (example for an AboutPage)
  const customSchemaData = {
    '@type': 'AboutPage',
    'datePublished': new Date().toISOString(),
    'lastReviewed': new Date().toISOString()
  };
  
  // Generate JSON-LD schema
  const jsonLd = generateSchema('about', customSchemaData);
  
  return (
    <>
      {/* SEO Head Component */}
      {pageMeta && (
        <SEOHead
          title={pageMeta.metaTitle}
          description={pageMeta.metaDescription}
          keywords={pageMeta.metaKeywords}
          canonicalUrl={window.location.href}
          ogTitle={pageMeta.metaTitle}
          ogDescription={pageMeta.metaDescription}
          ogUrl={window.location.href}
          jsonLd={jsonLd}
        />
      )}
      
      {/* Page Content */}
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="mb-4">
          This is an example page demonstrating how to implement SEO using react-helmet-async.
          The meta tags, title, and JSON-LD schema are dynamically loaded from the API.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Current SEO Settings:</h2>
          {pageMeta ? (
            <ul className="list-disc pl-5">
              <li><strong>Title:</strong> {pageMeta.metaTitle}</li>
              <li><strong>Description:</strong> {pageMeta.metaDescription}</li>
              <li><strong>Keywords:</strong> {pageMeta.metaKeywords}</li>
              <li><strong>Schema:</strong> {pageMeta.schema ? 'Provided' : 'Not provided'}</li>
            </ul>
          ) : (
            <p>Loading SEO data...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ExampleSEOPage;