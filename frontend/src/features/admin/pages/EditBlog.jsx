import React, { useState, useEffect } from "react";

const EditBlog = ({ blogData }) => {
  const [formData, setFormData] = useState({
    language: "",
    image: null,
    title: "",
    slug: "",
    category: "",
    content: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    schema: "",
    status: "Publish",
  });

  useEffect(() => {
    if (blogData) {
      setFormData({
        language: blogData.language,
        image: null,
        title: blogData.title,
        slug: blogData.slug,
        category: blogData.category,
        content: blogData.content,
        metaTitle: blogData.metaTitle,
        metaKeywords: blogData.metaKeywords,
        metaDescription: blogData.metaDescription,
        schema: blogData.schema,
        status: blogData.status,
      });
    }
  }, [blogData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    // API call here
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Language*</label>
            <select name="language" value={formData.language} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Image*</label>
            <input type="file" name="image" onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Title*</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Slug*</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category*</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Select Category</option>
              <option value="SAP">SAP</option>
              <option value="AWS">AWS</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Status*</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-2">
              <option value="Publish">Publish</option>
              <option value="Unpublish">Unpublish</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Content*</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="4" className="w-full border rounded p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Meta Title*</label>
            <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Meta Keywords</label>
            <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Meta Description</label>
            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Schema</label>
            <textarea name="schema" value={formData.schema} onChange={handleChange} className="w-full border rounded p-2" rows="4" />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;