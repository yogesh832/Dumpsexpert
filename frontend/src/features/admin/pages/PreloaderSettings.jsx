import React, { useEffect, useState } from "react";
import axios from "axios";

const PreloaderSettings = () => {
  const [active, setActive] = useState(false);
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchPreloader = async () => {
      try {
        const res = await axios.get(
          "https://dumpsexpert-2.onrender.com/api/preloader"
        );
        const data = res.data;
        setActive(data?.active || false);
        setBgColor(data?.backgroundColor || "#FFFFFF");
        setImagePreview(data?.imageUrl || null);
      } catch (err) {
        console.error("Failed to load preloader settings:", err.message);
      }
    };

    fetchPreloader();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("active", active);
    formData.append("backgroundColor", bgColor);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post(
        "https://dumpsexpert-2.onrender.com/api/preloader/update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert("✅ Preloader updated successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update preloader");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6 mt-10">
      <h2 className="text-lg font-semibold">Update Preloader</h2>

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <label className="font-semibold">
          Preloader <span className="text-red-500">*</span>
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={active}
            onChange={() => setActive(!active)}
          />
          <div
            className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ease-in-out ${
              active ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                active ? "translate-x-7" : ""
              }`}
            ></div>
          </div>
        </label>
        <span
          className={`ml-4 px-3 py-1 rounded text-white text-sm ${
            active ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {active ? "Active" : "Dactive"}
        </span>
      </div>

      {/* Image */}
      <div>
        <label className="block font-semibold mb-2">
          Preloader Icon <span className="text-red-500">*</span>
        </label>
        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Preloader"
              className="w-48 h-auto mx-auto rounded shadow"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block font-semibold mb-2">
          Background Color <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
      >
        Update
      </button>
    </div>
  );
};

export default PreloaderSettings;
