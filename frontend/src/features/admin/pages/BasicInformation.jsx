import React from 'react';

const BasicInformation = () => {
  return (
    <div className="w-full  mx-auto p-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
      </div>

      <form className="space-y-8">
        {/* Site Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter site title"
            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Currency Direction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency Direction <span className="text-red-500">*</span>
          </label>
          <select className="w-full border border-gray-300 rounded px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Direction</option>
            <option value="ltr">Left to Right</option>
            <option value="rtl">Right to Left</option>
          </select>
        </div>

        {/* Favicon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon <span className="text-red-500">*</span>
          </label>
          <label className="cursor-pointer inline-block bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700 transition duration-150">
            Choose File
            <input type="file" className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Upload 40x40 (Pixel) image for best quality. Only .jpg, .jpeg, .png are allowed.
          </p>
        </div>

        {/* Site Header Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Header Logo <span className="text-red-500">*</span>
          </label>
          <label className="cursor-pointer inline-block bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700 transition duration-150">
            Choose File
            <input type="file" className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Upload 150x40 (Pixel) image for best quality. Only .jpg, .jpeg, .png are allowed.
          </p>
        </div>

        {/* Breadcrumb Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Breadcrumb Image <span className="text-red-500">*</span>
          </label>
          <label className="cursor-pointer inline-block bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700 transition duration-150">
            Choose File
            <input type="file" className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Upload 1920x390 (Pixel) image for best quality. Only .jpg, .jpeg, .png are allowed.
          </p>
        </div>
      </form>
    </div>
  );
};

export default BasicInformation;
