import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useBlogStore from "../../../store/blogStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBlog = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || categoryId || "";
  const decodedInitialCategory = decodeURIComponent(initialCategory);
  const { blogCategories } = useBlogStore();

  const [formData, setFormData] = useState({
    title: "",
    // slug: "",
    category: decodedInitialCategory,
    content: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    schema: "",
    status: "unpublish",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories if not already loaded
  useEffect(() => {
    if (blogCategories.length === 0) {
      useBlogStore.getState().fetchBlogCategories();
    }
  }, [blogCategories.length]);

  const validateSchema = (schema) => {
    try {
      JSON.parse(schema);
      return "";
    } catch {
      return "Invalid JSON format in schema field.";
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedValue = name === "image" ? files[0] : value;

    // if (name === "title" && value) {
    //   const newSlug = value
    //     .toLowerCase()
    //     .replace(/[^a-z0-9]+/g, "-")
    //     .replace(/^-|-$/g, "");
    //   setFormData((prev) => ({ ...prev, slug: newSlug }));
    // }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    if (name === "schema") {
      const error = validateSchema(value);
      setErrors((prev) => ({ ...prev, schema: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let schemaDataObj = null;
      if (formData.schema) {
        try {
          schemaDataObj = JSON.parse(formData.schema);
        } catch (err) {
          toast.error("Invalid JSON in Schema Data");
          setSubmitting(false);
          return;
        }
      }

      const blogData = {
        title: formData.title,
        content: formData.content,
        category: formData.category || "",
        imageUrl: formData.image ? formData.image.name : "",
        status: "publish",
        metaTitle: formData.metaTitle || formData.title,
        metaKeywords: formData.metaKeywords || "default keywords",
        metaDescription: formData.metaDescription || "default description",
        schema: schemaDataObj ? JSON.stringify(schemaDataObj) : "{}",
      };

      const blogFormData = new FormData();
      blogFormData.append("title", blogData.title);
      blogFormData.append("content", blogData.content);
      if (formData.image) {
        blogFormData.append("image", formData.image);
      }
      blogFormData.append("category", blogData.category);
      blogFormData.append("status", blogData.status);
      blogFormData.append("metaTitle", blogData.metaTitle);
      blogFormData.append("metaKeywords", blogData.metaKeywords);
      blogFormData.append("metaDescription", blogData.metaDescription);
      blogFormData.append("schema", blogData.schema);

      const response = await axios.post(
        "http://localhost:8000/api/blogs/create",
        blogFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data) {
        useBlogStore.getState().addBlog(response.data.data);
        toast.success("Blog added successfully");
        navigate("/admin/blog/list");
      } else {
        toast.error(response.data.message || "Error adding blog");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto mt-8">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add Blog</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Blog Title"
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Blog Title"
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        {/* <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="Slug (URL-friendly title)"
          required
          className="w-full border px-3 py-2 rounded-md"
        /> */}
        <div className="mb-4 w-full">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Blog Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter category"
            required
          />
        </div>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="unpublish">Unpublished</option>
          <option value="publish">Published</option>
        </select>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Blog Content"
          rows={6}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          placeholder="Meta Title"
          maxLength={60}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="metaKeywords"
          value={formData.metaKeywords}
          onChange={handleChange}
          placeholder="Meta Keywords"
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <textarea
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          placeholder="Meta Description"
          rows={3}
          maxLength={160}
          required
          className="w-full border px-3 py-2 rounded-md"
        />
        <textarea
          name="schema"
          value={formData.schema}
          onChange={handleChange}
          placeholder="Paste valid JSON-LD here"
          rows={5}
          required
          className={`w-full border px-3 py-2 rounded-md ${
            errors.schema ? "border-red-500" : ""
          }`}
        />
        {errors.schema && (
          <p className="text-red-500 text-sm mt-1">{errors.schema}</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
