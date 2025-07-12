import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://dumpsexpert-2.onrender.com/api/products"
      );
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to load products");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `https://dumpsexpert-2.onrender.com/api/products/${id}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete product");
    }
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <button
            onClick={() => navigate("/admin/products/add")}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            + Add Product
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, i) => (
              <tr key={product._id} className="text-center">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-12 w-12 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2 border">{product.title}</td>
                <td className="p-2 border">{product.price}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 text-white text-xs rounded ${
                      product.status === "active"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-2 border space-x-1">
                  <button
                    onClick={() =>
                      navigate(`/admin/products/edit/${product._id}`)
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-pink-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-4 text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
