import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const SEOContext = createContext();

/**
 * SEO Provider Component
 * Fetches and provides SEO metadata for different pages
 */
export const SEOProvider = ({ children }) => {
  const [metaInfo, setMetaInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all meta information on component mount
  useEffect(() => {
    const fetchMetaInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/meta-info`);
        
        if (response.data && response.data.data) {
          // Convert the array to an object with page names as keys for easier access
          const metaObject = response.data.data.reduce((acc, item) => {
            acc[item.page] = item;
            return acc;
          }, {});
          
          setMetaInfo(metaObject);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching meta information:', err);
        setError('Failed to load SEO metadata');
      } finally {
        setLoading(false);
      }
    };

    fetchMetaInfo();
  }, []);

  /**
   * Get meta information for a specific page
   * @param {string} page - The page name (home, about, blog, etc.)
   * @returns {Object} The meta information for the page
   */
  const getPageMeta = (page) => {
    return metaInfo[page] || null;
  };

  /**
   * Generate JSON-LD schema for a page
   * @param {string} page - The page name
   * @param {Object} customData - Custom data to merge with the schema
   * @returns {string} The JSON-LD schema as a string
   */
  const generateSchema = (page, customData = {}) => {
    const pageMeta = getPageMeta(page);
    
    if (!pageMeta || !pageMeta.schema) return null;
    
    try {
      // Parse the stored schema
      const baseSchema = JSON.parse(pageMeta.schema);
      
      // Merge with custom data
      const finalSchema = { ...baseSchema, ...customData };
      
      return JSON.stringify(finalSchema);
    } catch (err) {
      console.error('Error parsing schema:', err);
      return null;
    }
  };

  // Context value
  const value = {
    metaInfo,
    loading,
    error,
    getPageMeta,
    generateSchema
  };

  return <SEOContext.Provider value={value}>{children}</SEOContext.Provider>;
};

/**
 * Custom hook to use the SEO context
 * @returns {Object} The SEO context
 */
export const useSEO = () => {
  const context = useContext(SEOContext);
  
  if (context === undefined) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  
  return context;
};

export default SEOContext;