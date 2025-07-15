import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import useBlogStore from '../../../store/blogStore';
import 'react-toastify/dist/ReactToastify.css';

const BlogPosts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { blogCategories, fetchBlogCategories, addBlog } = useBlogStore();
  const categories = Array.isArray(blogCategories) ? blogCategories : [];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: categoryId ? decodeURIComponent(categoryId) : '',
    image: null,
    status: 'draft',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    schemaData: '{}',
  });

  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch categories if not already loaded
  useEffect(() => {
    if (categories.length === 0) {
      fetchBlogCategories();
    }
  }, [categories.length, fetchBlogCategories]);

  // Clean up preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.content) newErrors.content = 'Content is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image) newErrors.image = 'Image is required';
    if (formData.schemaData) {
      try {
        JSON.parse(formData.schemaData);
      } catch {
        newErrors.schemaData = 'Invalid JSON format in schema';
      }
    }
    if (!formData.metaTitle) newErrors.metaTitle = 'Meta Title is required';
    if (!formData.metaKeywords) newErrors.metaKeywords = 'Meta Keywords are required';
    if (!formData.metaDescription) newErrors.metaDescription = 'Meta Description is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedValue = name === 'image' ? files[0] : value;

    if (name === 'title' && value) {
      const newSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'image' && files[0]) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    }

    if (name === 'schemaData') {
      try {
        JSON.parse(value);
        setErrors((prev) => ({ ...prev, schemaData: '' }));
      } catch {
        setErrors((prev) => ({ ...prev, schemaData: 'Invalid JSON format' }));
      }
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      return;
    }

    try {
      let schemaDataObj = null;
      if (formData.schemaData) {
        schemaDataObj = JSON.parse(formData.schemaData);
      }

      const blogData = {
        title: formData.title,
        content: formData.content,
        category: formData.category || '',
        excerpt: formData.excerpt || '',
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        status: formData.status === 'draft' ? 'unpublish' : 'publish',
        metaTitle: formData.metaTitle || formData.title,
        metaKeywords: formData.metaKeywords || 'default keywords',
        metaDescription: formData.metaDescription || 'default description',
        schema: schemaDataObj ? JSON.stringify(schemaDataObj) : '{}',
      };

      const blogFormData = new FormData();
      Object.entries(blogData).forEach(([key, value]) => {
        blogFormData.append(key, value);
      });
      if (formData.image) {
        blogFormData.append('image', formData.image);
      }

      const response = await axios.post('http://localhost:8000/api/blogs/create', blogFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.data.success) {
        addBlog(response.data.data);
        toast.success('Blog post added successfully');
        navigate(`/admin/blog/category/${encodeURIComponent(formData.category)}`);
      } else {
        let errorMessage = 'Error adding blog post';
        if (response.data.message) errorMessage += `: ${response.data.message}`;
        if (response.data.error) errorMessage += ` - ${response.data.error}`;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      let errorMessage = 'Error adding blog post';
      if (error.response?.data?.message) errorMessage += `: ${error.response.data.message}`;
      if (error.response?.data?.error) errorMessage += ` - ${error.response.data.error}`;
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Add Blog Post</h1>
      <form onSubmit={handleBlogSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Leave blank to auto-generate"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content <span className="text-red-500">*</span></label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="8"
            required
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          {categories.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Suggested Categories:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => setFormData((prev) => ({ ...prev, category: cat.category }))}
                    className={`px-3 py-1 text-sm rounded ${
                      formData.category === cat.category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Featured Image <span className="text-red-500">*</span></label>
          {previewUrl && (
            <div className="mb-2">
              <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
              <p className="text-sm text-gray-500">Image Preview</p>
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            required
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            maxLength={60}
            required
          />
          {errors.metaTitle && <p className="text-red-500 text-sm">{errors.metaTitle}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Keywords <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.metaKeywords && <p className="text-red-500 text-sm">{errors.metaKeywords}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description <span className="text-red-500">*</span></label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            maxLength={160}
            required
          />
          {errors.metaDescription && <p className="text-red-500 text-sm">{errors.metaDescription}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Schema Data (JSON)</label>
          <textarea
            name="schemaData"
            value={formData.schemaData}
            onChange={handleChange}
            className="w-full p-2 border rounded font-mono text-sm"
            rows="6"
            placeholder="Enter valid JSON for schema data"
          />
          {errors.schemaData && <p className="text-red-500 text-sm">{errors.schemaData}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting ? 'Adding...' : 'Add Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPosts;