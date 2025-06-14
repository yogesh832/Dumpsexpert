import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch SEO data for a specific page
 * @param {string} page - The page identifier to fetch SEO data for
 * @returns {Object} - SEO data and loading state
 */
const useSEO = (page) => {
  const [seoData, setSeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch SEO data for the specified page
        const response = await axios.get(`/api/seo/${page}`);
        
        setSeoData(response.data.data);
        setIsDefault(response.data.isDefault || false);
      } catch (err) {
        console.error('Error fetching SEO data:', err);
        setError(err.response?.data?.message || 'Failed to fetch SEO data');
        
        // If there's an error, try to fetch default SEO data
        try {
          const defaultResponse = await axios.get('/api/seo');
          setSeoData(defaultResponse.data.data?.default || null);
          setIsDefault(true);
        } catch (defaultErr) {
          console.error('Error fetching default SEO data:', defaultErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (page) {
      fetchSEOData();
    } else {
      setIsLoading(false);
      setError('Page identifier is required');
    }
  }, [page]);

  return { seoData, isLoading, error, isDefault };
};

export default useSEO;