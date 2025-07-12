import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // fixed import
import axios from "axios";

const BlogCategory = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://dumpsexpert-2.onrender.com/api/blog-categories"
        );
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch blog categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const filtered = categories.filter((cat) =>
    cat.sectionName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c._id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-xl font-semibold text-gray-700 mb-4">
        Blog Category
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Blog Category List</div>
          <div className="flex items-center gap-2">
            <select className="border px-2 py-1 rounded text-sm">
              <option>English</option>
              <option>Hindi</option>
            </select>
            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
              Bulk Delete
            </button>
            <Link to="/admin/blog/category/add">
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                + Add
              </button>
            </Link>
          </div>
        </div>

        {/* Search & Filter */}
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
            placeholder="Search section..."
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
                <th className="border p-2">
                  <input type="checkbox" />
                </th>
                <th className="border p-2">Image</th> {/* 👈 New column */}
                <th className="border p-2">Section Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Meta Title</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="border p-2">
                    <img
                      src={cat.imageUrl}
                      alt={cat.sectionName}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="border p-2">{cat.sectionName}</td>
                  <td className="border p-2">{cat.category?.name || "N/A"}</td>
                  <td className="border p-2">{cat.metaTitle}</td>
                  <td className="border p-2 space-x-2">
                    <Link to={`/admin/blog/category/edit/${cat._id}`}>
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-xs">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                    <Link to="/admin/blog/list">
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded text-xs">
                        Manage Blogs
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}

              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No blog categories found.
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
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
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
