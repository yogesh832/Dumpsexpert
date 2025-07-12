import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const EditProductCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("Ready");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/product-categories/${id}`
        );
        setName(res.data.name);
        setStatus(res.data.status || "Ready");
        setPreview(res.data.image);
      } catch (err) {
        console.error("❌ Failed to load category:", err);
        alert("Failed to load category");
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status", status);
    if (image) formData.append("image", image);

    try {
      await axios.put(
        `http://localhost:8000/api/product-categories/${id}`,
        formData
      );
      alert("Category updated successfully");
      navigate("/products/categories");
    } catch (err) {
      console.error(
        "❌ Error updating category:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Product Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          placeholder="Category Name"
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

        {preview && (
          <div>
            <p className="text-sm text-gray-600">Current Image:</p>
            <img
              src={preview}
              alt="Category Preview"
              className="w-20 h-auto mb-2"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditProductCategory;
