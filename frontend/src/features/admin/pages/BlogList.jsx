import React, { useState } from "react";
import EditBlog from "./EditBlog"; // Make sure this path is correct

const dummyBlogs = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1,
  language: "English",
  image: "https://via.placeholder.com/100x60.png?text=Blog",
  title: `Blog Title ${index + 1}`,
  slug: `blog-title-${index + 1}`,
  category: index % 2 === 0 ? "SAP" : "AWS",
  content: "Sample content",
  metaTitle: `Meta Title ${index + 1}`,
  metaKeywords: `keyword${index + 1}`,
  metaDescription: "Sample meta description",
  schema: "{}",
  status: "Publish",
}));

const BlogList = () => {
  const [blogs, setBlogs] = useState(dummyBlogs);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null); // 🔥
  const itemsPerPage = 10;

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
  };

  const handleUpdate = (updatedBlog) => {
    setBlogs((prev) =>
      prev.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
    setSelectedBlog(null); // close the edit form
  };

  if (selectedBlog) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <button
          onClick={() => setSelectedBlog(null)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          ← Back to List
        </button>
        <EditBlog blogData={selectedBlog} onUpdate={handleUpdate} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-xl font-bold mb-4">Blog List:</div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label>Show</label>
          <select className="border rounded p-1 text-sm">
            <option>10</option>
          </select>
          <label>entries</label>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow-md">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-600 uppercase">
            <tr>
              <th className="p-2"><input type="checkbox" /></th>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.map((blog) => (
              <tr key={blog.id} className="border-t hover:bg-gray-50">
                <td className="p-2"><input type="checkbox" /></td>
                <td className="p-2">
                  <img src={blog.image} alt="Blog" className="w-16 h-auto rounded" />
                </td>
                <td className="p-2">{blog.title}</td>
                <td className="p-2">{blog.category}</td>
                <td className="p-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                    {blog.status}
                  </span>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => setSelectedBlog(blog)} // 👈 Open editor
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentBlogs.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Showing {currentBlogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {(currentPage - 1) * itemsPerPage + currentBlogs.length} of {filteredBlogs.length} entries
        </div>
        <div className="space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
