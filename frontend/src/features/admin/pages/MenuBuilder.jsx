import React from 'react';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaExpandArrowsAlt, FaCheck, FaPlus, FaSyncAlt } from 'react-icons/fa';

const MenuBuilder = () => {
  return (
    <div className="p-6 w-full mx-auto">
      

      <div className="">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Menu Builder</h2>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Main Menu</button>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option>English</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Add/Edit Area */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-4">Add/Edit/Update Area</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Text</label>
                <input type="text" placeholder="Text" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input type="text" placeholder="URL" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target</label>
                <select className="w-full border rounded px-3 py-2">
                  <option value="">_self</option>
                  <option value="_blank">_blank</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded flex items-center gap-2">
                  <FaSyncAlt /> Update Menu
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2">
                  <FaPlus /> Add Menu
                </button>
              </div>
            </div>
          </div>

          {/* Main Menu Area */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-4">Main Menu Area</h3>
            {['Home', 'About Us', 'FAQ', 'Guarantee', 'Contact', 'Blogs', 'IT Dumps'].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border rounded px-3 py-2 mb-2">
                <span>{item}</span>
                <div className="flex gap-1 text-white text-sm">
                  <button className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-700" title="Move Up"><FaArrowUp /></button>
                  <button className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-700" title="Move Down"><FaArrowDown /></button>
                  <button className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600" title="Expand"><FaExpandArrowsAlt /></button>
                  <button className="bg-green-500 px-2 py-1 rounded hover:bg-green-600" title="Check"><FaCheck /></button>
                  <button className="bg-pink-500 px-2 py-1 rounded hover:bg-pink-600" title="Edit"><FaEdit /></button>
                  <button className="bg-red-500 px-2 py-1 rounded hover:bg-red-600" title="Delete"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Pre-Made Menu Area */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-4">Pre-Made Menu Area</h3>
            {['Home', 'About', 'Services', 'Portfolios', 'Pages', 'Packages', 'Team'].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border rounded px-3 py-2 mb-2">
                <span>{item}</span>
                <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                  <FaPlus />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBuilder;
