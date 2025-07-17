import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useBlogStore from "../../../store/blogStore";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories = [] } = useBlogStore(); // Ensure categories is always an array

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    // excerpt: "",
    content: "",
    category: "",
    image: null,
    status: "draft",
    language: "english",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    schemaData: "",
  });

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category") || "";
  const decodedCategoryFilter = decodeURIComponent(categoryFilter);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/blogs/id/${id}`);
        const blogData = res.data?.data;

        if (!blogData) {
          throw new Error("Blog not found");
        }

        const prefill = {
          title: blogData.title || "",
          // slug: blogData.slug || "",
          // excerpt: "", // Adjust if you support excerpt
          content: blogData.content || "",
          category: blogData.category || "",
          image: null,
          status: blogData.status || "draft",
          language: blogData.language || "english",
          metaTitle: blogData.metaTitle || "",
          metaKeywords: blogData.metaKeywords || "",
          metaDescription: blogData.metaDescription || "",
          schemaData: blogData.schema || "{}",
        };

        setFormData(prefill);
        setBlog(blogData);
      } catch (err) {
        console.error("Failed to fetch blog:", err.message);
        toast.error("Blog fetch error");
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let schemaDataObj = null;
    if (formData.schemaData) {
      try {
        schemaDataObj = JSON.parse(formData.schemaData);
      } catch {
        toast.error("Invalid JSON in Schema Data");
        setSubmitting(false);
        return;
      }
    }

    try {
      const blogFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "schemaData" && schemaDataObj) {
          blogFormData.append("schema", JSON.stringify(schemaDataObj));
        } else if (key === "image" && value) {
          blogFormData.append(key, value);
        } else if (value !== null) {
          blogFormData.append(key, value);
        }
      });

      await axios.put(`http://localhost:8000/api/blogs/${id}`, blogFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog updated successfully");
      navigate("/admin/blog/list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading blog data...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "title", type: "text" },
          { name: "slug", type: "text" },
          // { name: "excerpt", type: "textarea" },
          { name: "content", type: "textarea" },
          { name: "metaTitle", type: "text" },
          { name: "metaKeywords", type: "text" },
          { name: "metaDescription", type: "textarea" },
          { name: "schemaData", type: "textarea" },
        ].map(({ name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {name}
            </label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                rows={name === "schemaData" ? 6 : 3}
                className="w-full p-2 border rounded font-mono text-sm"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: cat }))
                  }
                  className={`px-3 py-1 text-sm rounded ${
                    formData.category === cat
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Featured Image
          </label>
          {blog?.imageUrl && !formData.image && (
            <div className="mb-2">
              <img
                src={blog.imageUrl}
                alt="Current"
                className="w-32 h-32 object-cover rounded"
              />
              <p className="text-sm text-gray-500">Current Image</p>
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="unpublish">Unpublish</option>
              <option value="publish">publish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/blog/list")}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
