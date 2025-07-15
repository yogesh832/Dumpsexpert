import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import useBlogStore from '../../../store/blogStore';

const BlogPosts = () => {
  const navigate = useNavigate();
  const { blogCategories, fetchBlogCategories, addBlog } = useBlogStore();
  const categories = Array.isArray(blogCategories) ? blogCategories : [];
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    image: null,
    status: 'draft',
    language: 'english',
    schemaData: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (categories.length === 0) {
      fetchBlogCategories();
    }
  }, [categories.length, fetchBlogCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let schemaDataObj = null;
      if (formData.schemaData) {
        try {
          schemaDataObj = JSON.parse(formData.schemaData);
        } catch (err) {
          toast.error('Invalid JSON in Schema Data');
          setSubmitting(false);
          return;
        }
      }

      const blogFormData = new FormData();
      for (const key in formData) {
        if (key === 'schemaData' && schemaDataObj) {
          blogFormData.append(key, JSON.stringify(schemaDataObj));
        } else if (key === 'image' && formData.image) {
          blogFormData.append(key, formData.image);
        } else {
          blogFormData.append(key, formData[key]);
        }
      }

      const response = await axios.post('http://localhost:8000/api/blogs', blogFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.data.success) {
        addBlog(response.data.data);
        toast.success('Blog post added successfully');
        navigate(`/admin/blog/category/${encodeURIComponent(formData.category)}`);
      } else {
        toast.error(response.data.message || 'Error adding blog post');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error adding blog post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Add Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
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
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="8"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter category"
            required
          />
          {categories.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Suggested Categories:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.category }))}
                    className={`px-3 py-1 text-sm rounded ${formData.category === cat.category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Featured Image</label>
          {previewUrl && (
            <div className="mb-2">
              <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
              <p className="text-sm text-gray-500">Image Preview</p>
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
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
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
