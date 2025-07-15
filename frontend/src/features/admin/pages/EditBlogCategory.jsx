import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import useBlogStore from '../../../store/blogStore';

const EditBlogCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBlogCategoryById, updateBlogCategory } = useBlogStore();
  const [category, setCategory] = useState(null);
  const [formData, setFormData] = useState({
    sectionName: '',
    category: '',
    image: null,
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    schema: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/blog-categories/${id}`);
        const categoryData = response.data;
        if (categoryData) {
          setCategory(categoryData);
          setFormData({
            sectionName: categoryData.sectionName || '',
            category: categoryData.category || '',
            image: null,
            metaTitle: categoryData.metaTitle || '',
            metaKeywords: categoryData.metaKeywords || '',
            metaDescription: categoryData.metaDescription || '',
            schema: categoryData.schema || ''
          });
          if (categoryData.imageUrl) {
            setPreviewUrl(categoryData.imageUrl);
          }
        } else {
          toast.error('Blog category not found');
          navigate('/admin/blog/categories');
        }
      } catch (error) {
        toast.error('Error loading category data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadCategory();
  }, [id, navigate]);

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
      if (formData.image && typeof formData.image !== 'string') {
        categoryFormData.append('image', formData.image);
      }
      categoryFormData.append('metaTitle', formData.metaTitle);
      categoryFormData.append('metaKeywords', formData.metaKeywords);
      categoryFormData.append('metaDescription', formData.metaDescription);
      if (schemaDataObj) {
        categoryFormData.append('schema', JSON.stringify(schemaDataObj));
      }

      const response = await axios.put(`http://localhost:8000/api/blog-categories/${id}`, categoryFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.data) {
        updateBlogCategory(response.data);
        toast.success('Blog category updated successfully');
        navigate('/admin/blog/category');
      } else {
        toast.error(response.data.message || 'Error updating blog category');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating blog category');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading category data...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Category</h1>
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
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Featured Image</label>
          {previewUrl && (
            <div className="mb-2">
              <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded" />
              <p className="text-sm text-gray-500">{formData.image ? 'New Image Preview' : 'Current Image'}</p>
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
            {submitting ? 'Updating...' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogCategory;
