import React, { useState } from 'react';
import { Link } from 'react-router';

const dummyCategories = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `Category ${i + 1}`,
  order: 0,
  status: 'Publish',
}));

const BlogCategory = () => {
  const [categories, setCategories] = useState(dummyCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-xl font-semibold text-gray-700 mb-4">Blog Category</div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Blog Category List</div>
          <div className="flex items-center gap-2">
            <select className="border px-2 py-1 rounded text-sm">
              <option>English</option>
              <option>Hindi</option>
            </select>
            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Bulk Delete</button>
          <Link to={"/admin/blog/posts"}>  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">+ Add</button></Link>
          <Link to={"/admin/blog/list"}>  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Blog List</button></Link>
          </div>
        </div>

        {/* Filter/Search */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-sm">
            Show
            <select className="border px-2 py-1 rounded">
              <option>10</option>
            </select>
            entries
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-1 rounded text-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2"><input type="checkbox" /></th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Order</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="border p-2"><input type="checkbox" /></td>
                  <td className="border p-2">{cat.name}</td>
                  <td className="border p-2">{cat.order}</td>
                  <td className="border p-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      {cat.status}
                    </span>
                  </td>
                  <td className="border p-2 space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-xs">Edit</button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCategory;
