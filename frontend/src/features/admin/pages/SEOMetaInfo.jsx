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
              <SEOForm 
                page={activeTab} 
                initialData={metaInfo[activeTab]} 
                onSave={(updatedData) => handleSave(activeTab, updatedData)} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOMetaInfo;