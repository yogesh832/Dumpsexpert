import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import useBlogStore from '../../../store/blogStore';

const AddBlogCategory = () => {
  const navigate = useNavigate();
  const { addBlogCategory, blogCategories, fetchBlogCategories } = useBlogStore();
  const [formData, setFormData] = useState({
    sectionName: '',
    category: '',
    image: null,
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    schema: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (blogCategories.length === 0) {
      fetchBlogCategories();
    }
  }, [blogCategories.length, fetchBlogCategories]);

  const categories = Array.isArray(blogCategories) ? blogCategories : [];

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
      if (formData.schema) {
        try {
          schemaDataObj = JSON.parse(formData.schema);
        } catch (err) {
          toast.error('Invalid JSON in Schema Data');
          setSubmitting(false);
          return;
        }
      }

      const categoryFormData = new FormData();
      categoryFormData.append('sectionName', formData.sectionName);
      categoryFormData.append('category', formData.category);
      if (formData.image) {
        categoryFormData.append('image', formData.image);
      }
      categoryFormData.append('metaTitle', formData.metaTitle);
      categoryFormData.append('metaKeywords', formData.metaKeywords);
      categoryFormData.append('metaDescription', formData.metaDescription);
      if (schemaDataObj) {
        categoryFormData.append('schema', JSON.stringify(schemaDataObj));
      }

      const response = await axios.post('http://localhost:8000/api/blog-categories', categoryFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.data) {
        addBlogCategory(response.data);
        toast.success('Blog category added successfully');
        navigate('/admin/blog/category');
      } else {
        toast.error(response.data.message || 'Error adding blog category');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding blog category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Add Blog Category</h1>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/admin/blog/list')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Manage Blogs
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Section Name</label>
          <input
            type="text"
            name="sectionName"
            value={formData.sectionName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.name }))}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {cat.name}
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
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Schema Data (JSON)</label>
          <textarea
            name="schema"
            value={formData.schema}
            onChange={handleChange}
            className="w-full p-2 border rounded font-mono text-sm"
            rows="6"
            placeholder="Enter valid JSON for schema data"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/blog/category')}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogCategory;
