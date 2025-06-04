import React, { useState } from 'react';

const sampleData = Array.from({ length: 47 }).map((_, index) => ({
  id: index + 1,
  examCode: `EXAM-${index + 1}`,
  category: 'SAP',
  email: `user${index + 1}@example.com`,
  date: `2025-06-${(index % 30) + 1}`.padStart(10, '0'),
}));

const DownloadedSamples = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = sampleData.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-xl font-semibold text-gray-700 mb-2">Sample Downloaded</div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Email List</h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select className="border rounded px-3 py-1 text-sm">
            <option>All</option>
          </select>
          <input type="date" className="border rounded px-3 py-1 text-sm" />
          <input type="text" className="border rounded px-3 py-1 text-sm flex-1" placeholder="Search" />
          <button className="bg-blue-500 text-white px-4 py-1 rounded text-sm">Export</button>
          <button className="bg-yellow-400 text-white px-4 py-1 rounded text-sm">View</button>
          <button className="bg-gray-300 text-gray-800 px-4 py-1 rounded text-sm">Clear</button>
        </div>

        {/* Bulk Delete */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-sm">
            Show
            <select className="border rounded px-2 py-1">
              <option>10</option>
            </select>
            entries
          </div>
          <button className="bg-red-500 text-white px-4 py-1 rounded text-sm">Bulk Delete</button>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border"><input type="checkbox" /></th>
                <th className="p-2 border">Exam Code</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="p-2 border"><input type="checkbox" /></td>
                  <td className="p-2 border">{row.examCode}</td>
                  <td className="p-2 border">{row.category}</td>
                  <td className="p-2 border">{row.email}</td>
                  <td className="p-2 border">{row.date}</td>
                  <td className="p-2 border">
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadedSamples;


