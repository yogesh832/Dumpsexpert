import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const defaultSchemaPlaceholder = `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Your Page Title",
  "url": "https://example.com/your-page"
}`;

const SEOMetaInfo = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      
      // Gather form data for the current page
      const formData = {};
      const pagePrefix = activeTab;
      
      // Get all input and textarea elements for the current page
      const inputs = document.querySelectorAll(`[name^='${pagePrefix}']`);
      
      inputs.forEach(input => {
        const fieldName = input.name.replace(pagePrefix, '').toLowerCase();
        formData[fieldName] = input.value;
      });
      
      // Map form data to SEO schema fields
      const seoData = {
        title: formData.title || '',
        description: formData.description || '',
        keywords: formData.keywords || '',
        ogTitle: formData.ogtitle || '',
        ogDescription: formData.ogdescription || '',
        ogImage: formData.ogimage || '',
        ogUrl: formData.ogurl || '',
        twitterTitle: formData.twittertitle || '',
        twitterDescription: formData.twitterdescription || '',
        twitterImage: formData.twitterimage || '',
        twitterCard: formData.twittercard || 'summary_large_image',
        canonicalUrl: formData.canonicalurl || '',
        schema: formData.schema || ''
      };
      
      // Send data to API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/seo/${activeTab}`,
        seoData,
        { withCredentials: true }
      );
      
      toast.success(`SEO data for ${activeTab} page sent successfully!`);
    } catch (error) {
      console.error('Error sending SEO data:', error);
      toast.error(error.response?.data?.message || 'Failed to send SEO data');
    } finally {
      setLoading(false);
    }
  };

  const pages = ['home', 'about', 'blog', 'sap', 'contact'];

  const fields = [
    // Basic SEO fields
    { name: 'Title', label: 'Meta Title' },
    { name: 'Keywords', label: 'Meta Keywords' },
    { name: 'Description', label: 'Meta Description', textarea: true },
    
    // Open Graph fields
    { name: 'OgTitle', label: 'OG Title' },
    { name: 'OgDescription', label: 'OG Description', textarea: true },
    { name: 'OgImage', label: 'OG Image URL' },
    { name: 'OgUrl', label: 'OG URL' },
    
    // Twitter Card fields
    { name: 'TwitterTitle', label: 'Twitter Title' },
    { name: 'TwitterDescription', label: 'Twitter Description', textarea: true },
    { name: 'TwitterImage', label: 'Twitter Image URL' },
    { name: 'TwitterCard', label: 'Twitter Card Type' },
    
    // Additional SEO fields
    { name: 'CanonicalUrl', label: 'Canonical URL' },
    { name: 'Schema', label: 'JSON-LD Schema', textarea: true },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">SEO Information</h2>
      
      {/* Page Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {pages.map((page) => (
            <li key={page} className="mr-2">
              <button
                onClick={() => setActiveTab(page)}
                className={`inline-block p-4 ${activeTab === page
                  ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active'
                  : 'text-gray-500 hover:text-gray-600 hover:border-gray-300 border-b-2 border-transparent rounded-t-lg'}`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)} Page
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-5">
        <h3 className="text-xl font-medium text-gray-700 mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page SEO Settings
        </h3>
        
        {/* Group fields by category */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-600 mb-3">Basic SEO</h4>
          <div className="space-y-4">
            {fields.slice(0, 3).map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 mb-1">{field.label}</label>
                {field.textarea ? (
                  <textarea
                    name={`${activeTab}${field.name}`}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    name={`${activeTab}${field.name}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-600 mb-3">Open Graph</h4>
          <div className="space-y-4">
            {fields.slice(3, 7).map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 mb-1">{field.label}</label>
                {field.textarea ? (
                  <textarea
                    name={`${activeTab}${field.name}`}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    name={`${activeTab}${field.name}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-600 mb-3">Twitter Card</h4>
          <div className="space-y-4">
            {fields.slice(7, 11).map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 mb-1">{field.label}</label>
                {field.name === 'TwitterCard' ? (
                  <select
                    name={`${activeTab}${field.name}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image" selected>Summary Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                ) : field.textarea ? (
                  <textarea
                    name={`${activeTab}${field.name}`}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    name={`${activeTab}${field.name}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-600 mb-3">Additional SEO</h4>
          <div className="space-y-4">
            {fields.slice(11).map((field) => (
              <div key={field.name}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-gray-700">{field.label}</label>
                  {field.name === 'Schema' && (
                    <button
                      type="button"
                      onClick={() => {
                        const schemaField = document.querySelector(`[name='${activeTab}${field.name}']`);
                        try {
                          const formatted = JSON.stringify(JSON.parse(schemaField.value), null, 2);
                          schemaField.value = formatted;
                        } catch (error) {
                          toast.error('Invalid JSON format. Cannot format.');
                        }
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Format JSON
                    </button>
                  )}
                </div>
                {field.textarea ? (
                  <textarea
                    name={`${activeTab}${field.name}`}
                    rows={field.name === 'Schema' ? 8 : 4}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${field.name === 'Schema' ? 'font-mono text-sm' : ''} placeholder-gray-400`}
                    placeholder={
                      field.name === 'Schema'
                        ? defaultSchemaPlaceholder
                        : `Enter ${field.label.toLowerCase()}...`
                    }
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    name={`${activeTab}${field.name}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send to SEO Schema'}
        </button>
      </div>
    </div>
  );
};

export default SEOMetaInfo;




// import React from 'react';

// const defaultSchemaPlaceholder = `{
//   "@context": "https://schema.org",
//   "@type": "WebPage",
//   "name": "Your Page Title",
//   "url": "https://example.com/your-page"
// }`;

// const SEOMetaInfo = () => {
//   const handleSend = () => {
//     alert('Data sent (mock)');
//   };

//   const fields = [
//     { name: 'homeTitle', label: 'Home Page - Meta Title' },
//     { name: 'homeKeywords', label: 'Meta Keywords' },
//     { name: 'homeDescription', label: 'Home Page - Meta Description', textarea: true },
//     { name: 'homeSchema', label: 'Home Page - Schema', textarea: true },
//     { name: 'aboutTitle', label: 'About Page - Meta Title' },
//     { name: 'aboutKeywords', label: 'About Page - Meta Keyword' },
//     { name: 'aboutDescription', label: 'About Page - Meta Description', textarea: true },
//     { name: 'aboutSchema', label: 'About Page - Schema', textarea: true },
//     { name: 'blogTitle', label: 'Blog Page - Meta Title' },
//     { name: 'blogKeywords', label: 'Blog Page - Meta Keyword' },
//     { name: 'blogDescription', label: 'Blog Page - Meta Description', textarea: true },
//     { name: 'blogSchema', label: 'Blog Page - Schema', textarea: true },
//     { name: 'sapTitle', label: 'SAP Page - Meta Title' },
//     { name: 'sapKeywords', label: 'SAP Page - Meta Keyword' },
//     { name: 'sapDescription', label: 'SAP Page - Meta Description', textarea: true },
//     { name: 'sapSchema', label: 'SAP Page - Schema', textarea: true },
//     { name: 'contactTitle', label: 'Contact Page - Meta Title' },
//     { name: 'contactKeywords', label: 'Contact Page - Meta Keyword' },
//     { name: 'contactDescription', label: 'Contact Page - Meta Description', textarea: true },
//     { name: 'contactSchema', label: 'Contact Page - Schema', textarea: true },
//   ];

//   return (
//     <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto mt-10">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add SEO Info</h2>

//       <div className="space-y-5">
//         {fields.map((field) => (
//           <div key={field.name}>
//             <label className="block text-gray-700 mb-1">{field.label}</label>

//             {field.textarea ? (
//               <textarea
//                 name={field.name}
//                 rows={field.name.includes('Schema') ? 6 : 4}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm placeholder-gray-400"
//                 placeholder={
//                   field.name.includes('Schema')
//                     ? defaultSchemaPlaceholder
//                     : `Enter ${field.label.toLowerCase()}...`
//                 }
//               ></textarea>
//             ) : (
//               <input
//                 type="text"
//                 name={field.name}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
//                 placeholder={`Enter ${field.label.toLowerCase()}...`}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 flex justify-end">
//         <button
//           onClick={handleSend}
//           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SEOMetaInfo;
