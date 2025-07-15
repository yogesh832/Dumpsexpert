import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EditBlog from "./EditBlog";
import useBlogStore from "../../../store/blogStore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogList = () => {
  const { loading: storeLoading, error: storeError, setBlogs, setLoading, setError } = useBlogStore();
  const [blogs, setLocalBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState({
    title: '',
    content: '',
    category: '',
    imageUrl: '',
    status: 'draft',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    schema: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category') || '';
  const decodedCategoryFilter = decodeURIComponent(categoryFilter);

  console.log('Category filter from query params:', decodedCategoryFilter);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const url = decodedCategoryFilter 
          ? `http://localhost:8000/api/blogs/all?page=${currentPage}&limit=10&category=${encodeURIComponent(decodedCategoryFilter)}`
          : `http://localhost:8000/api/blogs/all?page=${currentPage}&limit=10`;
        console.log('Fetching blogs with URL:', url);
        console.log('Category filter applied:', decodedCategoryFilter);
        const res = await axios.get(url);
        console.log('API response full data:', res.data);
        console.log('Blogs received:', res.data.data || []);
        setLocalBlogs(res.data.data || []);
        setBlogs(res.data.data || []); // Update store if needed
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        }
        setError("Failed to fetch blogs: " + err.message);
        toast.error("Failed to fetch blogs", { position: "top-right", autoClose: 3000 });
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, decodedCategoryFilter, setBlogs, setLoading, setError]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:8000/api/blogs/${id}`, {
          withCredentials: true
        });
        setLocalBlogs(blogs.filter(blog => blog._id !== id));
        toast.success("Blog deleted successfully", { position: "top-right", autoClose: 3000 });
      } catch (err) {
        console.error("Failed to delete blog:", err);
        toast.error("Failed to delete blog", { position: "top-right", autoClose: 3000 });
      }
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(search.toLowerCase()) || 
    blog.content.toLowerCase().includes(search.toLowerCase())
  );

  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const handleUpdate = async (updatedBlog) => {
    try {
      console.log('Updating blog:', updatedBlog);
      const submissionData = new FormData();
      Object.keys(updatedBlog).forEach((key) => {
        if (key === 'image' && updatedBlog[key] instanceof File) {
          submissionData.append(key, updatedBlog[key]);
        } else if (updatedBlog[key] !== undefined && updatedBlog[key] !== null) {
          submissionData.append(key, updatedBlog[key]);
        }
      });

      const response = await axios.put(
        `http://localhost:8000/api/blogs/${updatedBlog._id}`,
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      console.log('Update response from backend:', response.data);
      setLocalBlogs(blogs.map(blog => blog._id === updatedBlog._id ? response.data.data : blog));
      setSelectedBlog(null); // close the edit form
      // Force a refresh of the blog list
      const fetchBlogs = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/blogs/all', {
            withCredentials: true
          });
          setLocalBlogs(response.data.data);
        } catch (error) {
          console.error('Error refreshing blogs:', error);
          toast.error("Failed to refresh blogs", { position: "top-right", autoClose: 3000 });
        }
      };
      fetchBlogs();
      toast.success("Blog updated successfully", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error('Update Error:', error);
      console.error('Full error response:', error.response);
      toast.error(error.response?.data?.message || 'Network error while updating blog', { position: "top-right", autoClose: 3000 });
    }
  };

  const validateSchema = (schema) => {
    try {
      JSON.parse(schema);
      return "";
    } catch {
      return "Invalid JSON format in schema field.";
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    const updatedValue = name === "image" ? files[0] : value;

    if (name === "title" && value) {
      const newSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setEditingBlog((prev) => ({ ...prev, slug: newSlug }));
    }

    setEditingBlog((prev) => ({ ...prev, [name]: updatedValue }));

    if (name === "schema") {
      const error = validateSchema(value);
      setFormErrors((prev) => ({ ...prev, schema: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const schemaError = validateSchema(editingBlog.schema);
    if (schemaError) {
      setFormErrors({ schema: schemaError });
      toast.error(schemaError, { position: "top-right", autoClose: 3000 });
      return;
    }

    const submissionData = new FormData();
    Object.keys(editingBlog).forEach((key) => {
      submissionData.append(key, editingBlog[key]);
    });

    try {
      const response = await axios.post(
        'http://localhost:8000/api/blogs/create',
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      console.log('Response from backend:', response.data);
      setLocalBlogs([...blogs, response.data.data]);
      toast.success("Blog added successfully", { position: "top-right", autoClose: 3000 });
      setEditingBlog({
        title: '',
        content: '',
        category: '',
        imageUrl: '',
        status: 'draft',
        metaTitle: '',
        metaKeywords: '',
        metaDescription: '',
        schema: ''
      });
      setIsEditing(false);
      // Navigate back to the filtered list if a category filter is applied
      if (decodedCategoryFilter) {
        navigate(`/admin/blog/list?category=${encodeURIComponent(decodedCategoryFilter)}`);
      } else {
        navigate('/admin/blog/list');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error("Failed to add blog", { position: "top-right", autoClose: 3000 });
    }
  };

  if (storeLoading) return <div className="p-6">Loading data, please wait...</div>;
  if (storeError) return <div className="p-6 text-red-600">Error: {storeError}</div>;

  if (selectedBlog) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            ← Back to List
          </button>
          <EditBlog blogData={selectedBlog} onUpdate={(updatedBlog) => handleUpdate(updatedBlog)} />
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-gray-900 font-sans">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
          <button
            onClick={() => setIsEditing(false)}
            className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            ← Back to List
          </button>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 max-w-5xl mx-auto">
            <div className="mb-4 w-full px-2">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingBlog.title}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="mb-4 w-full px-2">
              <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">
                Slug (URL-friendly title) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={editingBlog.slug}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter slug"
                required
              />
            </div>

            <div className="mb-4 w-full px-2">
              <label htmlFor="language" className="block text-gray-700 text-sm font-bold mb-2">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                id="language"
                name="language"
                value={editingBlog.language}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div className="mb-4 w-full px-2">
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                Blog Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={editingBlog.category}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter category"
                required
              />
            </div>

            <div className="mb-4 w-full px-2">
              <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                accept="image/*"
                required
              />
            </div>

            <div className="mb-4 w-full px-2 md:col-span-2">
              <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={editingBlog.content}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
                placeholder="Enter blog content"
                required
              ></textarea>
            </div>

            <div className="mb-4 w-full px-2">
              <label htmlFor="metaTitle" className="block text-gray-700 text-sm font-bold mb-2">
                Meta Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={editingBlog.metaTitle}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter meta title"
                required
              />
            </div>

            <div className="mb-4 w-full px-2">
              <label htmlFor="metaKeywords" className="block text-gray-700 text-sm font-bold mb-2">
                Meta Keywords <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="metaKeywords"
                name="metaKeywords"
                value={editingBlog.metaKeywords}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter meta keywords"
                required
              />
            </div>

            <div className="mb-4 w-full px-2 md:col-span-2">
              <label htmlFor="metaDescription" className="block text-gray-700 text-sm font-bold mb-2">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={editingBlog.metaDescription}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                placeholder="Enter meta description"
                required
              ></textarea>
            </div>

            <div className="mb-4 w-full px-2 md:col-span-2">
              <label htmlFor="schema" className="block text-gray-700 text-sm font-bold mb-2">
                Schema (JSON Format)
              </label>
              {formErrors.schema && (
                <p className="text-red-500 text-sm mb-2">{formErrors.schema}</p>
              )}
              <textarea
                id="schema"
                name="schema"
                value={editingBlog.schema}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                placeholder="Enter schema in JSON format"
              ></textarea>
            </div>

            <div className="mb-4 w-full px-2">
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={editingBlog.status}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="unpublish">Unpublished</option>
                <option value="publish">Published</option>
              </select>
            </div>

            <div className="mb-4 w-full px-2 md:col-span-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900 font-sans">
      <ToastContainer />
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Blog List</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Blog
          </button>
        </div>
        <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded py-2 px-3 w-full md:w-1/3"
          />
          <select
            value={decodedCategoryFilter}
            onChange={(e) => navigate(`/admin/blog?category=${e.target.value}`)}
            className="border rounded py-2 px-3 w-full md:w-1/3"
          >
            <option value="">All Categories</option>
            {[...new Set(blogs.map(blog => blog.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm font-light border-collapse border border-gray-300">
            <thead className="border-b font-medium bg-gray-200">
              <tr>
                <th className="px-6 py-4 border border-gray-300">#</th>
                <th className="px-6 py-4 border border-gray-300">Image</th>
                <th className="px-6 py-4 border border-gray-300">Title</th>
                <th className="px-6 py-4 border border-gray-300">Category</th>
                <th className="px-6 py-4 border border-gray-300">Status</th>
                <th className="px-6 py-4 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBlogs.map((blog, index) => (
                <tr key={blog._id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-200">
                  <td className="px-6 py-4 border border-gray-300">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="px-6 py-4 border border-gray-300">
                    <img src={blog.imageUrl} alt={blog.title} className="h-10 w-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 border border-gray-300">{blog.title}</td>
                  <td className="px-6 py-4 border border-gray-300">{blog.category}</td>
                  <td className="px-6 py-4 border border-gray-300">{blog.status}</td>
                  <td className="px-6 py-4 border border-gray-300">
                    <button
                      onClick={() => {
                        setSelectedBlog(blog);
                        console.log("Navigating to edit blog with ID:", blog._id);
                        console.log("Blog object being passed:", blog);
                        // Navigate to edit page with blog ID and preserve category filter if present
                        const editUrl = decodedCategoryFilter 
                          ? `/admin/blog/edit/${blog._id}?category=${encodeURIComponent(decodedCategoryFilter)}`
                          : `/admin/blog/edit/${blog._id}`;
                        console.log("Navigating to URL:", editUrl);
                        navigate(editUrl);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mx-1 px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="mx-1 px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
