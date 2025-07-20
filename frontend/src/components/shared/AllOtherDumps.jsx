import React, { useEffect, useState } from "react";
import { instance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const AllOtherDumps = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await instance.get("/api/blog-categories");
        const validCategories = res.data?.filter(cat => !!cat.category);
        const allCategories = [{ _id: "all", category: "All" }, ...validCategories];
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch blogs on category change
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!selectedCategory) return;
      setLoadingBlogs(true);
      try {
        const endpoint = selectedCategory === "all"
          ? "/api/blogs/all?page=1&limit=6"
          : `/api/blogs/all?page=1&limit=6&category=${selectedCategory}`;

        const res = await instance.get(endpoint);
        setBlogs(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory]);

  return (
    <div className="py-10 px-4 md:px-20 bg-white">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center mb-8">
        Blog Categories & Posts
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {loadingCategories ? (
          <div>Loading categories...</div>
        ) : (
          categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.category.toLowerCase())}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === cat.category.toLowerCase()
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-800"
              } hover:bg-blue-600 hover:cursor-pointer transition`}
            >
              {cat.category}
            </button>
          ))
        )}
      </div>

      {/* Blogs */}
      {loadingBlogs ? (
        <div className="text-center text-gray-500">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-500">No blogs found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => navigate(`/blogs/${blog.slug}`)}
                className="cursor-pointer border rounded-lg py-4 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {blog.metaDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* See All Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/blogs")}
              className="px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
            >
              See All Blogs
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllOtherDumps;
