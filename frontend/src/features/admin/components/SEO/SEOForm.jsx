import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * SEO Form Component for managing SEO settings in the admin panel
 * @param {Object} props
 * @param {string} props.page - The page name (home, about, blog, etc.)
 * @param {Object} props.initialData - Initial SEO data for the page
 * @param {Function} props.onSave - Callback function after successful save
 */
const SEOForm = ({ page, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    schema: ''
  });
  const [loading, setLoading] = useState(false);
  const [schemaError, setSchemaError] = useState('');

  // Initialize form with data when available
  useEffect(() => {
    if (initialData) {
      setFormData({
        metaTitle: initialData.metaTitle || '',
        metaKeywords: initialData.metaKeywords || '',
        metaDescription: initialData.metaDescription || '',
        schema: initialData.schema || ''
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear schema error when schema is edited
    if (name === 'schema') {
      setSchemaError('');
    }
  };

  // Validate JSON-LD schema
  const validateSchema = (schema) => {
    if (!schema.trim()) return true; // Empty schema is valid
    
    try {
      const parsed = JSON.parse(schema);
      return typeof parsed === 'object' && parsed !== null;
    } catch (error) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate schema if provided
    if (formData.schema && !validateSchema(formData.schema)) {
      setSchemaError('Invalid JSON format. Please check your schema.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/meta-info/${page}`,
        formData,
        { withCredentials: true }
      );
      
      toast.success('SEO settings saved successfully');
      if (onSave) onSave(response.data.data);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save SEO settings');
    } finally {
      setLoading(false);
    }
  };

  // Format JSON for better readability
  const formatJSON = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(formData.schema), null, 2);
      setFormData(prev => ({ ...prev, schema: formatted }));
    } catch (error) {
      setSchemaError('Invalid JSON format. Cannot format.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Meta Title
        </label>
        <input
          type="text"
          id="metaTitle"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Page Title | Site Name"
        />
      </div>
      
      <div>
        <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-1">
          Meta Keywords
        </label>
        <input
          type="text"
          id="metaKeywords"
          name="metaKeywords"
          value={formData.metaKeywords}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>
      
      <div>
        <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Brief description of the page content (150-160 characters recommended)"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="schema" className="block text-sm font-medium text-gray-700">
            JSON-LD Schema
          </label>
          <button
            type="button"
            onClick={formatJSON}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Format JSON
          </button>
        </div>
        <textarea
          id="schema"
          name="schema"
          value={formData.schema}
          onChange={handleChange}
          rows="8"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm ${schemaError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder='{"@context":"https://schema.org","@type":"WebPage","name":"Page Name"}'
        />
        {schemaError && (
          <p className="mt-1 text-sm text-red-600">{schemaError}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Enter valid JSON-LD schema markup. Leave empty if not needed.
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>
    </form>
  );
};

export default SEOForm;