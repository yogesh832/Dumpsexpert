import { useState } from "react";
import {
  FaDownload,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const SEOSiteMap = () => {
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Sitemap</h1>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <span className="mr-2">+ Add Sitemap</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label className="mr-2 text-gray-700">Show</label>
          <select
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
            className="border rounded px-2 py-1 text-gray-700"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2 text-gray-700">entries</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-1 text-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 text-left">File Name</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder row - you can map over real data here */}
            <tr className="border-b">
              <td className="py-4 px-6 text-gray-700">-</td>
              <td className="py-4 px-6 flex space-x-2">
                <button className="text-green-500 hover:text-green-700">
                  <FaDownload size={20} />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrash size={20} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 text-gray-700 disabled:text-gray-400"
        >
          <FaChevronLeft className="mr-2" />
          Previous
        </button>
        <span className="px-4 py-2 bg-blue-500 text-white rounded">
          {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="flex items-center px-4 py-2 text-gray-700"
        >
          Next
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SEOSiteMap;
