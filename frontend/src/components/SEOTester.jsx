import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SEOTester.css';

const SEOTester = () => {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('home');
  const [isDefault, setIsDefault] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    schema: ''
  });

  // Fetch SEO data for the selected page
  const fetchSEOData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get SEO data for the specified page
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/seo/${page}`);
      
      setSeoData(response.data.data);
      setIsDefault(response.data.isDefault || false);
      
      // Update form data with fetched data
      setFormData({
        title: response.data.data.title || '',
        description: response.data.data.description || '',
        keywords: response.data.data.keywords || '',
        ogTitle: response.data.data.ogTitle || '',
        ogDescription: response.data.data.ogDescription || '',
        ogImage: response.data.data.ogImage || '',
        twitterTitle: response.data.data.twitterTitle || '',
        twitterDescription: response.data.data.twitterDescription || '',
        twitterImage: response.data.data.twitterImage || '',
        canonicalUrl: response.data.data.canonicalUrl || '',
        schema: response.data.data.schema || ''
      });
    } catch (err) {
      console.error('Error fetching SEO data:', err);
      setError(err.response?.data?.message || 'Failed to fetch SEO data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all SEO settings
  const fetchAllSEO = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/seo`);
      
      setSeoData(response.data.data);
      setPage('all');
    } catch (err) {
      console.error('Error fetching all SEO settings:', err);
      setError(err.response?.data?.message || 'Failed to fetch all SEO settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission to update SEO settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (page === 'default') {
        // Update default SEO settings
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/seo/default`,
          formData,
          { withCredentials: true }
        );
      } else {
        // Update page-specific SEO settings
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/seo/${page}`,
          formData,
          { withCredentials: true }
        );
      }
      
      setSeoData(response.data.data);
      setUpdateMode(false);
      alert('SEO settings updated successfully!');
    } catch (err) {
      console.error('Error updating SEO settings:', err);
      setError(err.response?.data?.message || 'Failed to update SEO settings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    if (page === 'all') {
      fetchAllSEO();
    } else if (page) {
      fetchSEOData();
    }
  }, [page]);

  return (
    <div className="seo-tester-container">
      <h1>SEO API Tester</h1>
      
      <div className="page-selector">
        <label htmlFor="page-select">Select Page:</label>
        <select 
          id="page-select" 
          value={page} 
          onChange={(e) => setPage(e.target.value)}
          disabled={loading}
        >
          <option value="all">All SEO Settings</option>
          <option value="default">Default Settings</option>
          <option value="home">Home Page</option>
          <option value="about">About Page</option>
          <option value="blog">Blog Page</option>
          <option value="contact">Contact Page</option>
          <option value="products">Products Page</option>
          {/* Add more pages as needed */}
        </select>
        
        <button 
          onClick={() => page === 'all' ? fetchAllSEO() : fetchSEOData()} 
          disabled={loading}
          className="refresh-button"
        >
          Refresh Data
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : seoData ? (
        <div className="seo-data-container">
          {page !== 'all' && (
            <div className="seo-actions">
              <button 
                onClick={() => setUpdateMode(!updateMode)}
                className="toggle-update-button"
              >
                {updateMode ? 'Cancel Update' : 'Update SEO Settings'}
              </button>
              
              {isDefault && page !== 'default' && (
                <div className="default-notice">
                  Using default SEO settings. No custom settings for this page.
                </div>
              )}
            </div>
          )}
          
          {updateMode ? (
            <form onSubmit={handleSubmit} className="seo-form">
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={60}
                />
                <span className="char-count">{formData.title.length}/60</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={160}
                  rows={3}
                />
                <span className="char-count">{formData.description.length}/160</span>
              </div>
              
              <div className="form-group">
                <label htmlFor="keywords">Keywords:</label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                />
              </div>
              
              <h3>Open Graph</h3>
              
              <div className="form-group">
                <label htmlFor="ogTitle">OG Title:</label>
                <input
                  type="text"
                  id="ogTitle"
                  name="ogTitle"
                  value={formData.ogTitle}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ogDescription">OG Description:</label>
                <textarea
                  id="ogDescription"
                  name="ogDescription"
                  value={formData.ogDescription}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ogImage">OG Image URL:</label>
                <input
                  type="text"
                  id="ogImage"
                  name="ogImage"
                  value={formData.ogImage}
                  onChange={handleInputChange}
                />
              </div>
              
              <h3>Twitter</h3>
              
              <div className="form-group">
                <label htmlFor="twitterTitle">Twitter Title:</label>
                <input
                  type="text"
                  id="twitterTitle"
                  name="twitterTitle"
                  value={formData.twitterTitle}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="twitterDescription">Twitter Description:</label>
                <textarea
                  id="twitterDescription"
                  name="twitterDescription"
                  value={formData.twitterDescription}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="twitterImage">Twitter Image URL:</label>
                <input
                  type="text"
                  id="twitterImage"
                  name="twitterImage"
                  value={formData.twitterImage}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="canonicalUrl">Canonical URL:</label>
                <input
                  type="text"
                  id="canonicalUrl"
                  name="canonicalUrl"
                  value={formData.canonicalUrl}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="schema">JSON-LD Schema:</label>
                <textarea
                  id="schema"
                  name="schema"
                  value={formData.schema}
                  onChange={handleInputChange}
                  rows={6}
                  className="code-input"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? 'Updating...' : 'Update SEO Settings'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setUpdateMode(false)} 
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="seo-display">
              {page === 'all' ? (
                <div>
                  <h2>Default SEO Settings</h2>
                  <pre>{JSON.stringify(seoData.default, null, 2)}</pre>
                  
                  <h2>Page-Specific SEO Settings</h2>
                  {seoData.pages && Object.keys(seoData.pages).length > 0 ? (
                    Object.entries(seoData.pages).map(([pageName, pageData]) => (
                      <div key={pageName} className="page-seo">
                        <h3>{pageName}</h3>
                        <pre>{JSON.stringify(pageData, null, 2)}</pre>
                      </div>
                    ))
                  ) : (
                    <p>No page-specific SEO settings found.</p>
                  )}
                </div>
              ) : (
                <pre>{JSON.stringify(seoData, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="no-data">No SEO data available. Select a page and click Refresh.</div>
      )}
    </div>
  );
};

export default SEOTester;