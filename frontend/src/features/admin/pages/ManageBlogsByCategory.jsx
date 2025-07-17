import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ManageBlogsByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const decodedCategory = categoryId ? decodeURIComponent(categoryId) : "";
  console.log("Category value from useParams:", categoryId);
  console.log("Decoded category value:", decodedCategory);
  console.log("Full location object:", location);

  if (!categoryId || categoryId === "undefined" || !decodedCategory) {
    console.log("No valid category value provided, showing error message.");
    console.log("categoryId:", categoryId);
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-red-500">
          Error: Category Not Specified
        </h1>
        <p className="mb-4">
          No category value was provided. Please select a category from the list
          to manage blogs.
        </p>
        <button
          onClick={() => navigate("/admin/blog/category")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/blog-categories?category=${encodeURIComponent(
            decodedCategory
          )}`
        );
        if (res.data && res.data.data && res.data.data.length > 0) {
          setCategoryName(
            res.data.data[0].sectionName ||
              res.data.data[0].category ||
              "Unknown Category"
          );
        } else {
          setCategoryName(decodedCategory);
        }
      } catch (err) {
        console.error("Error fetching category name:", err);
        setCategoryName("Unknown Category");
      }
    };

    fetchCategoryName();
  }, [decodedCategory]);
  //
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const url =
          decodedCategory && decodedCategory !== "undefined"
            ? `http://localhost:8000/api/blogs/all?page=${currentPage}&limit=10&category=${encodeURIComponent(
                decodedCategory
              )}`
            : `http://localhost:8000/api/blogs/all?page=${currentPage}&limit=10`;
        console.log("Fetching blogs with URL:", url);
        console.log("Category used for filtering:", decodedCategory);
        const res = await axios.get(url);
        console.log("API response:", res.data);
        setBlogs(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        }
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [decodedCategory, currentPage]);

  const handleAddBlog = () => {
    navigate(`/admin/blog/add?category=${encodeURIComponent(decodedCategory)}`);
  };

  const handleEditBlog = (id) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:8000/api/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        toast.success("Blog deleted successfully");
      } catch (err) {
        console.error("Error deleting blog:", err);
        toast.error("Failed to delete blog");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "publish" ? "draft" : "publish";
    try {
      const res = await axios.put(`http://localhost:8000/api/blogs/${id}`, {
        status: newStatus,
      });
      if (res.data) {
        setBlogs(
          blogs.map((blog) =>
            blog._id === id ? { ...blog, status: newStatus } : blog
          )
        );
        toast.success(
          `Blog ${
            newStatus === "publish" ? "published" : "unpublished"
          } successfully`
        );
      }
    } catch (err) {
      console.error(
        `Error ${
          newStatus === "publish" ? "publishing" : "unpublishing"
        } blog:`,
        err
      );
      toast.error(
        `Failed to ${newStatus === "publish" ? "publish" : "unpublish"} blog`
      );
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">
        Manage Blogs for {categoryName}
      </h1>
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => navigate("/admin/blog/category")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Categories
        </button>
        <button
          onClick={handleAddBlog}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Blog
        </button>
      </div>
      {loading && <div>Loading blogs...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && blogs.length === 0 && (
        <div>No blogs found for this category.</div>
      )}
      {!loading && !error && blogs.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="border p-4 rounded shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p>Status: {blog.status}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEditBlog(blog._id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleToggleStatus(blog._id, blog.status)}
                  className={`font-bold py-1 px-2 rounded ${
                    blog.status === "publish"
                      ? "bg-yellow-500 hover:bg-yellow-700"
                      : "bg-blue-400 hover:bg-blue-600"
                  } text-white`}
                >
                  {blog.status === "publish" ? "Unpublish" : "Publish"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBlogsByCategory;
