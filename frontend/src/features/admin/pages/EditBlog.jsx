import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import useBlogStore from '../../../store/blogStore';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories } = useBlogStore();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    image: null,
    status: 'draft',
    language: 'english',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    schemaData: ''
  });

  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category') || '';
  const decodedCategoryFilter = decodeURIComponent(categoryFilter);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError("No blog ID provided");
        setLoading(false);
        toast.error("No blog ID provided", { position: "top-right", autoClose: 3000 });
        navigate(decodedCategoryFilter ? `/admin/blog/list?category=${encodeURIComponent(decodedCategoryFilter)}` : "/admin/blog/list");
        return;
      }

      setLoading(true);
      // Set a timeout to stop loading after 15 seconds if API doesn't respond
      const timeoutId = setTimeout(() => {
        setError("Request timed out. Please check your internet connection or server status.");
        setLoading(false);
        toast.error("Failed to load blog data: Timeout", { position: "top-right", autoClose: 3000 });
        console.log("API request timed out after 15 seconds.");
        // Set dummy data to allow form interaction for testing
        const dummyData = {
          title: "Dummy Title (Timeout Case)",
          language: "en",
          slug: "dummy-slug-timeout",
          category: "test-timeout",
          content: "This is dummy content for testing after a timeout.",
          metaTitle: "Dummy Meta Title (Timeout)",
          metaKeywords: "dummy, timeout, test",
          metaDescription: "Dummy description for testing after timeout.",
          schema: "{}",
          status: "draft",
          image: null,
        };
        setFormData(dummyData);
        setBlog(dummyData);
      }, 15000);

      try {
        console.log("Fetching blog data for ID:", id);
        console.log("Full API URL:", `http://localhost:8000/api/blogs/all?page=1&limit=1&id=${id}`);
        let response;
        try {
          console.log("Trying endpoint to fetch single blog by ID: http://localhost:8000/api/blogs/all?page=1&limit=1&id=${id}");
          response = await axios.get(`http://localhost:8000/api/blogs/all?page=1&limit=1&id=${id}`, {
            withCredentials: true,
            timeout: 10000 // Set a 10-second timeout for axios
          });
        } catch (primaryError) {
          console.error("Primary endpoint failed:", primaryError);
          console.log("Trying fallback endpoint: http://localhost:8000/api/blogs/${id}");
          response = await axios.get(`http://localhost:8000/api/blogs/${id}`, {
            withCredentials: true,
            timeout: 10000 // Set a 10-second timeout for axios
          });
        }
        clearTimeout(timeoutId); // Cancel the timeout if API responds
        console.log("Raw API response (full object):", JSON.stringify(response, null, 2));
        console.log("Response headers:", JSON.stringify(response.headers, null, 2));
        console.log("Response status:", response.status);
        console.log("Blog data received (raw data):", JSON.stringify(response.data, null, 2));
        let blogData = response.data || {};
        console.log("Initialized blogData:", blogData);
        // Handle different response structures
        if (response.data && typeof response.data === 'object') {
          console.log("response.data is an object");
          if ('data' in response.data) {
            console.log("'data' key exists in response.data");
            if (Array.isArray(response.data.data)) {
              console.log("response.data.data is an array");
              if (response.data.data.length > 0) {
                blogData = response.data.data[0];
                console.log("Using first item from data array in response:", blogData);
              } else {
                console.log("response.data.data array is empty");
              }
            } else {
              console.log("response.data.data is not an array, using as is:", response.data.data);
              blogData = response.data.data;
            }
          } else if ('blog' in response.data) {
            blogData = response.data.blog;
            console.log("Using nested blog field from response:", blogData);
          } else {
            console.log("No 'data' or 'blog' key in response.data, using response.data as is");
          }
        } else {
          console.log("response.data is not an object, using initialized empty object");
        }
        if (blogData) {
          setBlog(blogData);
          const formDataToSet = {
            title: blogData.title || "",
            language: blogData.language || "en",
            slug: blogData.slug || "",
            category: blogData.category || "",
            content: blogData.content || "",
            metaTitle: blogData.metaTitle || "",
            metaKeywords: blogData.metaKeywords || "",
            metaDescription: blogData.metaDescription || "",
            schema: blogData.schema || "{}",
            status: blogData.status || "draft",
            image: null,
          };
          console.log("Setting form data with:", formDataToSet);
          setFormData(formDataToSet);
          // Force form update check
          setTimeout(() => {
            console.log("Current formData after setting:", formData);
            if (JSON.stringify(formData) !== JSON.stringify(formDataToSet)) {
              console.log("Form data not updated yet, forcing update.");
              setFormData(formDataToSet);
            }
            // Check if form fields in DOM are updated
            const titleField = document.querySelector('input[name="title"]');
            if (titleField) {
              console.log("Title field value in DOM:", titleField.value);
            } else {
              console.log("Title field not found in DOM.");
            }
          }, 100);
          setLoading(false);
        } else {
          setError("Blog data not found");
          toast.error("Blog not found", { position: "top-right", autoClose: 3000 });
          console.log("Setting dummy data to test form rendering.");
          const dummyData = {
            title: "Dummy Title",
            language: "en",
            slug: "dummy-slug",
            category: "test",
            content: "This is dummy content for testing.",
            metaTitle: "Dummy Meta Title",
            metaKeywords: "dummy, test",
            metaDescription: "Dummy description for testing.",
            schema: "{}",
            status: "draft",
            image: null,
          };
          setFormData(dummyData);
          setBlog(dummyData);
          setLoading(false);
          // Do not navigate away, allow dummy data to show
        }
      } catch (error) {
        clearTimeout(timeoutId); // Cancel the timeout if error occurs
        console.error("Error fetching blog data:", error);
        if (error.response) {
          console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
          console.error("Error response status:", error.response.status);
        }
        if (error.code === "ECONNABORTED") {
          setError("Timeout error: The request took too long to complete.");
          toast.error("Timeout error: Could not load blog data", { position: "top-right", autoClose: 3000 });
        } else {
          setError(error.message || "Failed to fetch blog data");
          toast.error(error.response?.data?.message || "Failed to fetch blog data", { position: "top-right", autoClose: 3000 });
        }
        console.log("Setting dummy data to test form rendering after error.");
        const dummyData = {
          title: "Dummy Title (Error Case)",
          language: "en",
          slug: "dummy-slug-error",
          category: "test-error",
          content: "This is dummy content for testing after an error.",
          metaTitle: "Dummy Meta Title (Error)",
          metaKeywords: "dummy, error, test",
          metaDescription: "Dummy description for testing after error.",
          schema: "{}",
          status: "draft",
          image: null,
        };
        setFormData(dummyData);
        setBlog(dummyData);
        setLoading(false);
        // Do not navigate away, allow dummy data to show
      }
    };

    fetchBlog();
  }, [id, navigate, location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

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

    try {
      const blogFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'schemaData' && schemaDataObj) {
          blogFormData.append(key, JSON.stringify(schemaDataObj));
        } else if (key === 'image' && value) {
          blogFormData.append(key, value);
        } else if (value !== null) {
          blogFormData.append(key, value);
        }
      });

      await axios.put(`http://localhost:8000/api/blogs/${id}`, blogFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Blog updated successfully');
      navigate('/admin/blog/list');

    } catch (err) {
      console.error('Error updating blog:', err);
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading blog data...</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'title', type: 'text' },
          { name: 'slug', type: 'text' },
          { name: 'excerpt', type: 'textarea' },
          { name: 'content', type: 'textarea' },
          { name: 'metaTitle', type: 'text' },
          { name: 'metaKeywords', type: 'text' },
          { name: 'metaDescription', type: 'textarea' },
          { name: 'schemaData', type: 'textarea' }
        ].map(({ name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1 capitalize">{name}</label>
            {type === 'textarea' ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                rows={name === 'schemaData' ? 6 : 2}
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
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                  className={`px-3 py-1 text-sm rounded ${
                    formData.category === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Featured Image</label>
          {blog?.image && !formData.image && (
            <div className="mb-2">
              <img src={blog.image} alt="Current" className="w-32 h-32 object-cover rounded" />
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

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/blog/list')}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
