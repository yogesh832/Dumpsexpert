import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

// Dummy data
const dummySocialLinks = [
  { icon: 'facebook', url: 'https://facebook.com/example' },
  { icon: 'twitter', url: 'https://twitter.com/example' },
  { icon: 'instagram', url: 'https://instagram.com/example' },
  { icon: 'linkedin', url: 'https://linkedin.com/in/example' },
  { icon: 'youtube', url: 'https://youtube.com/@example' },
];

const icons = {
  facebook: <FaFacebookF />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedinIn />,
  youtube: <FaYoutube />,
};

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState(dummySocialLinks);
  const [selectedIcon, setSelectedIcon] = useState('facebook');
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!url) return;
    setSocialLinks([...socialLinks, { icon: selectedIcon, url }]);
    setUrl('');
  };

  const handleDelete = (index) => {
    const updated = [...socialLinks];
    updated.splice(index, 1);
    setSocialLinks(updated);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Social Links</h2>

      {/* Add Social Link */}
      <div className="bg-white p-4 shadow-md rounded mb-8">
        <h3 className="text-lg font-medium mb-3">Add Social Links</h3>

        <div className="flex gap-4 mb-4">
          <select
            className="border px-3 py-2 rounded w-40"
            value={selectedIcon}
            onChange={(e) => setSelectedIcon(e.target.value)}
          >
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
          </select>

          <input
            type="text"
            className="border px-3 py-2 rounded flex-1"
            placeholder="Social URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>

      {/* Social Links List */}
      <div className="bg-white p-4 shadow-md rounded">
        <h3 className="text-lg font-medium mb-3">Social Links List</h3>

        <table className="w-full table-auto border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Icon</th>
              <th className="border px-4 py-2">URL</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {socialLinks.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2 text-xl">{icons[item.icon]}</td>
                <td className="border px-4 py-2">{item.url}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {socialLinks.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No social links added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SocialLinks;
