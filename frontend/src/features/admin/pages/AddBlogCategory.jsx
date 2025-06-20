import React, { useState } from "react";

const AddBlogCategoryForm = () => {
  const [formData, setFormData] = useState({
    sectionName: "",
    category: "",
    imageUrl: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    schema: "",
  });

  const [errors, setErrors] = useState({});

  const validateSchema = (schema) => {
    try {
      JSON.parse(schema);
      return "";
    } catch {
      return "Invalid JSON format in schema field.";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "schema") {
      const error = validateSchema(value);
      setErrors((prev) => ({ ...prev, schema: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate schema before submitting
    const schemaError = validateSchema(formData.schema);
    if (schemaError) {
      setErrors({ schema: schemaError });
      return;
    }

    // Log form data before sending
    console.log("Submitting formData:", formData);

    try {
      const response = await fetch("http://localhost:8000/api/blog/blog-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Log response from backend
      console.log("Response from backend:", data);

      if (response.ok) {
        alert("Blog category added successfully");
        setFormData({
          sectionName: "",
          category: "",
          imageUrl: "",
          metaTitle: "",
          metaKeywords: "",
          metaDescription: "",
          schema: "",
        });
        setErrors({});
      } else {
        alert(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Network error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Add Blog Category
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        {/* Section Name */}
        <div>
          <label className="block font-medium text-gray-700">Section Name</label>
          <input
            type="text"
            name="sectionName"
            value={formData.sectionName}
            onChange={handleChange}
            required
            className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Meta Title */}
        <div>
          <label className="block font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            maxLength={60}
            required
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Meta Keywords */}
        <div>
          <label className="block font-medium text-gray-700">Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            required
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block font-medium text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={3}
            maxLength={160}
            required
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Schema */}
        <div>
          <label className="block font-medium text-gray-700">JSON-LD Schema</label>
          <textarea
            name="schema"
            value={formData.schema}
            onChange={handleChange}
            rows={5}
            required
            placeholder={`Paste valid JSON-LD here like:
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Example Title"
}`}
            className={`mt-1 w-full border px-3 py-2 rounded-md ${
              errors.schema ? "border-red-500" : ""
            }`}
          />
          {errors.schema && (
            <p className="text-red-500 text-sm mt-1">{errors.schema}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBlogCategoryForm;
