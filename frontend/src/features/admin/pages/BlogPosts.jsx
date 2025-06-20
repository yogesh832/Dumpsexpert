import React, { useState } from 'react';

const BlogPosts = () => {
  const [formData, setFormData] = useState({
    language: '',
    image: null,
    title: '',
    category: '',
    content: '',
    metaTitle: '',
    metaKeywords: '',
    metaDescription: '',
    schema: '',
    status: 'Unpublish',
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Blog Post Submitted (Check Console)');
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="text-xl font-semibold text-gray-700 mb-4">Add Blog </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-6">
        {/* Language */}
        <div>
          <label className="block font-medium mb-1">Language<span className="text-red-500">*</span></label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a Language</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Image<span className="text-red-500">*</span></label>
          <div className="border p-4 rounded text-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="mx-auto w-[200px] h-[130px] object-contain" />
            ) : (
              <div className="text-gray-400">NO IMAGE FOUND</div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <input type="file" onChange={handleImageChange} />
            <span className="text-xs text-gray-500">
              Upload 730x455 (Pixel) | Only jpg, jpeg, png allowed.
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category<span className="text-red-500">*</span></label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option>Business</option>
            <option>Technology</option>
            <option>News</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">Content<span className="text-red-500">*</span></label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="5"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Meta Title */}
        <div>
          <label className="block font-medium mb-1">Meta Title<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="metaTitle"
            placeholder="Meta Title"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="block font-medium mb-1">Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            placeholder="Meta Keywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block font-medium mb-1">Meta Description</label>
          <textarea
            name="metaDescription"
            rows="3"
            placeholder="Meta Description"
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Schema */}
        <div>
          <label className="block font-medium mb-1">Schema</label>
          <textarea
            name="schema"
            rows="3"
            placeholder="<script></script>"
            value={formData.schema}
            onChange={handleChange}
            className="w-full border p-2 rounded font-mono"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status<span className="text-red-500">*</span></label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Unpublish</option>
            <option>Publish</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPosts;
