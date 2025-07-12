import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const iconMap = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  youtube: <FaYoutube />,
};

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("facebook");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const api = "https://dumpsexpert-2.onrender.com/api/social-links";

  // Fetch all links on component load
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(api);
      setSocialLinks(res.data);
    } catch (err) {
      console.error("Error fetching links:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!url.trim()) return alert("URL cannot be empty!");

    try {
      const res = await axios.post(api, {
        icon: selectedIcon,
        url: url.trim(),
      });
      setSocialLinks([...socialLinks, res.data]);
      setUrl("");
    } catch (err) {
      console.error("Error adding link:", err.response?.data || err.message);
      alert("Failed to add link.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await axios.delete(`${api}/${id}`);
      setSocialLinks(socialLinks.filter((link) => link._id !== id));
    } catch (err) {
      console.error("Error deleting link:", err);
      alert("Failed to delete link.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Social Links Manager</h2>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-3 items-center mb-6">
        <select
          value={selectedIcon}
          onChange={(e) => setSelectedIcon(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {Object.keys(iconMap).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter social link URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : socialLinks.length === 0 ? (
          <p>No links added.</p>
        ) : (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Icon</th>
                <th className="border px-4 py-2">URL</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {socialLinks.map((link, index) => (
                <tr key={link._id}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center text-xl">
                    {iconMap[link.icon]}
                  </td>
                  <td className="border px-4 py-2 break-words">{link.url}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(link._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;
