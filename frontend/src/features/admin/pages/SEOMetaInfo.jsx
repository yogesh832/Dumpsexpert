import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';
import SEOForm from '../components/SEO/SEOForm';

const SEOMetaInfo = () => {
  const [metaInfo, setMetaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en'); // Default language

  // Fetch meta information on component mount
  useEffect(() => {
    fetchMetaInfo();
  }, []);

  const fetchMetaInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/meta-info`, {
        withCredentials: true
      });
      
      if (response.data && response.data.data) {
        setMetaInfo(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching meta information:', error);
      toast.error('Failed to load SEO metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (page, updatedData) => {
    // Update the local state with the new data
    setMetaInfo(prev => ({
      ...prev,
      [page]: updatedData
    }));
    
    toast.success(`${page.charAt(0).toUpperCase() + page.slice(1)} page SEO settings updated successfully`);
  };

  // Function to send data to SEO schema
  const handleSendToSEO = async () => {
    if (!metaInfo || !activeTab || !metaInfo[activeTab]) {
      toast.error('No SEO data available to send');
      return;
    }

    try {
      setLoading(true);
      
      // Convert meta info to SEO schema format
      const seoData = {
        title: metaInfo[activeTab].metaTitle || '',
        description: metaInfo[activeTab].metaDescription || '',
        keywords: metaInfo[activeTab].metaKeywords || '',
        ogTitle: metaInfo[activeTab].metaTitle || '',
        ogDescription: metaInfo[activeTab].metaDescription || '',
        ogImage: '',
        twitterTitle: metaInfo[activeTab].metaTitle || '',
        twitterDescription: metaInfo[activeTab].metaDescription || '',
        twitterImage: '',
        canonicalUrl: '',
        schema: metaInfo[activeTab].schema || ''
      };

      // Send POST request to save to SEO schema
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/seo/${activeTab}`,
        seoData,
        { withCredentials: true }
      );
      
      toast.success(`SEO data for ${activeTab} page has been sent to SEO schema successfully`);
    } catch (error) {
      console.error('Error sending SEO data to schema:', error);
      toast.error(error.response?.data?.message || 'Failed to send SEO data to schema');
    } finally {
      setLoading(false);
    }
  };

  // Available pages for SEO configuration
  const pages = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'About Page' },
    { id: 'faq', label: 'FAQ Page' },
    { id: 'contact', label: 'Contact Page' },
    { id: 'blog', label: 'Blog Page' }
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <FaHome className="text-gray-700" />
          <span className="text-gray-500">/</span>
          <span className="text-gray-700 font-semibold">SEO Management</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md bg-white"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          >
            <span>{language === 'en' ? 'English' : 'Español'}</span>
            <IoChevronDown className="text-gray-700" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Update SEO Information</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {/* Tabs for different pages */}
            <div className="flex border-b mb-6">
              {pages.map(page => (
                <button
                  key={page.id}
                  className={`px-4 py-2 font-medium ${activeTab === page.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab(page.id)}
                >
                  {page.label}
                </button>
              ))}
            </div>

            {/* SEO Form for the active tab */}
            {metaInfo && (
              <div>
                <SEOForm 
                  page={activeTab} 
                  initialData={metaInfo[activeTab]} 
                  onSave={(updatedData) => handleSave(activeTab, updatedData)} 
                />
                
                {/* Send to SEO Schema button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleSendToSEO}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send to SEO Schema'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOMetaInfo;