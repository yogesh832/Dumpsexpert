import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import axios from "axios";

const Permalink = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch permalinks
  const fetchPermalinks = async () => {
    try {
      const res = await axios.get(
        "https://dumpsexpert-2.onrender.com/api/permalinks",
        {
          withCredentials: true,
        }
      );
      setPages(res.data);
    } catch (error) {
      console.error("Failed to load permalinks:", error);
    }
  };

  // Handle input change
  const handleChange = (index, newSlug) => {
    const updatedPages = [...pages];
    updatedPages[index].slug = newSlug;
    setPages(updatedPages);
  };

  // Submit update
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        "https://dumpsexpert-2.onrender.com/api/permalinks",
        pages,
        {
          withCredentials: true,
        }
      );
      alert("Permalinks updated successfully!");
    } catch (error) {
      alert("Update failed.");
      console.error(error);
    }
    setLoading(false);
  };

  // Optional: Seed default permalinks
  const handleSeed = async () => {
    try {
      await axios.post(
        "https://dumpsexpert-2.onrender.com/api/permalinks/seed",
        {},
        {
          withCredentials: true,
        }
      );
      await fetchPermalinks();
      alert("Permalinks reset to default!");
    } catch (err) {
      alert("Failed to seed.");
      console.error("Seeding error:", err);
    }
  };

  useEffect(() => {
    fetchPermalinks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaLink className="text-blue-600" />
        Permalink
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page, index) => (
          <div key={index} className="space-y-1">
            <label className="font-medium">Page Name : {page.pageName}</label>
            <input
              type="text"
              value={page.slug}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500">
              Full Path : <span className="text-gray-700">/{page.slug}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <button
          onClick={handleSeed}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default Permalink;
