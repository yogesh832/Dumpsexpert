import React, { useState } from 'react';

const mockData = [
  { id: 1, name: 'ISACA', status: 'Publish' },
  { id: 2, name: '-', status: 'Publish' },
  { id: 3, name: 'ORACLE', status: 'Publish' },
  { id: 4, name: 'Microsoft', status: 'Publish' },
];

const ProductCategories = () => {
  const [search, setSearch] = useState('');

  const filteredData = mockData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Product Categories</h2>
        <div className="flex space-x-2">
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
            Bulk Delete
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            + Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label>Show&nbsp;
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>&nbsp;entries
            </label>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 px-3 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full table-auto border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 border">
                  <input type="checkbox" />
                </td>
                <td className="p-2 border">[Image]</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    {item.status}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600">
                    Edit
                  </button>
                  <button className="bg-pink-500 text-white px-3 py-1 rounded text-xs hover:bg-pink-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCategories;
