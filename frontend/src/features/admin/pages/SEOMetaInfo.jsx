import { FaHome } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';

const SEOMetaInfo = () => {
  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <FaHome className="text-gray-700" />
          <span className="text-gray-500">/</span>
          <span className="text-gray-700 font-semibold">SEO</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md bg-white">
            <span>English</span>
            <IoChevronDown className="text-gray-700" />
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6">Update SEO Information</h2>

      <div className="space-y-8">
        {/* Home Page Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Home Page - Meta Title</h3>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <h3 className="text-lg font-medium mt-6 mb-3">Home Page - Meta Keywords</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>

          <h3 className="text-lg font-medium mt-6 mb-3">Home Page - Meta Description</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>

          <h3 className="text-lg font-medium mt-6 mb-3">Home Page - Schema</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          ></textarea>
        </div>

        {/* About Page Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">About Page - Meta Title</h3>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="About Us | Learn More About Our Mission"
          />

          <h3 className="text-lg font-medium mt-6 mb-3">About Page - Meta Keywords</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Learn about our mission, vision, and values. Discover who we are and what drives us to provide the best services."
          ></textarea>

          <h3 className="text-lg font-medium mt-6 mb-3">About Page - Meta Description</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Discover our story, mission, and values. Learn more about our team and what motivates us to deliver exceptional solutions."
          ></textarea>

          <h3 className="text-lg font-medium mt-6 mb-3">About Page - Schema</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Company Name",\n  "description": "About our company..."\n}'}
          ></textarea>
        </div>

        {/* FAQ Page Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">FAQ Page - Meta Title</h3>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="FAQ - Frequently Asked Questions | Original Dumps"
          />

          <h3 className="text-lg font-medium mt-6 mb-3">FAQ Page - Meta Keywords</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Get answers to frequently asked questions about exam dumps and certification exams. Our FAQ page covers common concerns such as the authenticity of refund policies."
          ></textarea>

          <h3 className="text-lg font-medium mt-6 mb-3">FAQ Page - Meta Description</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Get answers to frequently asked questions about exam dumps and certification exams. Our FAQ page covers common concerns such as the authenticity of refund policies."
          ></textarea>

          <h3 className="text-lg font-medium mt-6 mb-3">FAQ Page - Schema</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  ...\n}'}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default SEOMetaInfo;