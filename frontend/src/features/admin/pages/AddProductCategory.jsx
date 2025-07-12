import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AddProductCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("Ready");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status", status);
    formData.append("image", image);

    try {
      await axios.post(
        "https://dumpsexpert-2.onrender.com/api/product-categories",
        formData
      );
      alert("Category added successfully");
      navigate("/admin/products/categories");
    } catch (err) {
      console.error(
        "❌ Error submitting form:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Product Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Ready">Ready</option>
          <option value="Publish">Publish</option>
        </select>

        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddProductCategory;
