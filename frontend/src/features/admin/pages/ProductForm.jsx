import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { instance } from '../../../lib/axios';
import { useNavigate, useParams } from 'react-router';

const ProductForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sapExamCode: '',
    title: '',
    price: '',
    category: '',
    status: '',
    action: '',
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    instance
      .get('/api/product-categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (mode === 'edit' && id) {
      instance
        .get(`/api/products/${id}`)
        .then((res) => {
          const p = res.data.data;
          setForm({
            sapExamCode: p.sapExamCode,
            title: p.title,
            price: p.price,
            category: p.category,
            status: p.status,
            action: p.action,
            image: null,
          });
        })
        .catch(() => setError('Failed to load product'));
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      if (mode === 'add') {
        await instance.post('/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await instance.put(`/api/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate('/admin/products/list');
    } catch (err) {
      setError(err.response?.data?.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await instance.delete(`/api/products/${id}`);
      navigate('/admin/products/list');
    } catch (err) {
      setError('Failed to delete product');
      console.log(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {mode === 'add' ? 'Add New Product' : 'Edit Product'}
      </h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="sapExamCode"
          value={form.sapExamCode}
          onChange={handleChange}
          placeholder="SAP Exam Code"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Status</option>
          <option value="active">Publish</option>
          <option value="inactive">Unpublish</option>
        </select>

        <select
          name="action"
          value={form.action}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Action</option>
          <option value="edit">Edit</option>
          <option value="review">Review</option>
        </select>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
          {...(mode === 'add' && { required: true })}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>

          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
