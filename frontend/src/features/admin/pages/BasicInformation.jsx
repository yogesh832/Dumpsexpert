import React, { useEffect, useState } from "react";
import axios from "axios";

const BasicInformation = () => {
  const [siteTitle, setSiteTitle] = useState("");
  const [currencyDirection, setCurrencyDirection] = useState("");
  const [favicon, setFavicon] = useState(null);
  const [headerLogo, setHeaderLogo] = useState(null);
  const [breadcrumbImage, setBreadcrumbImage] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState("");
  const [headerLogoPreview, setHeaderLogoPreview] = useState("");
  const [breadcrumbPreview, setBreadcrumbPreview] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/basic-info");
        const data = res.data;

        setSiteTitle(data.siteTitle || "");
        setCurrencyDirection(data.currencyDirection || "");

        if (data.faviconUrl) setFaviconPreview(data.faviconUrl);
        if (data.headerLogoUrl) setHeaderLogoPreview(data.headerLogoUrl);
        if (data.breadcrumbImageUrl) setBreadcrumbPreview(data.breadcrumbImageUrl);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!token || !userId) {
      setMessage("❌ Token or user ID not found in localStorage.");
      return;
    }

    const formData = new FormData();
    formData.append("siteTitle", siteTitle);
    formData.append("currencyDirection", currencyDirection);
    formData.append("userId", userId); // ✅ Backend requires this

    if (favicon) formData.append("favicon", favicon);
    if (headerLogo) formData.append("headerLogo", headerLogo);
    if (breadcrumbImage) formData.append("breadcrumbImage", breadcrumbImage);

    try {
      const res = await axios.put("http://localhost:8000/api/basic-info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Settings updated successfully!");
      const updated = res.data.data;

      // Refresh previews
      setFaviconPreview(updated.faviconUrl || "");
      setHeaderLogoPreview(updated.headerLogoUrl || "");
      setBreadcrumbPreview(updated.breadcrumbImageUrl || "");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Something went wrong"));
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Update Basic Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          placeholder="Site Title"
          className="border w-full p-2 rounded"
          required
        />

        <select
          value={currencyDirection}
          onChange={(e) => setCurrencyDirection(e.target.value)}
          className="border w-full p-2 rounded"
          required
        >
          <option value="">Select Currency Direction</option>
          <option value="ltr">Left to Right</option>
          <option value="rtl">Right to Left</option>
        </select>

        <div>
          <label className="block mb-1 text-gray-700">Favicon</label>
          {faviconPreview && (
            <img src={faviconPreview} alt="Favicon Preview" className="h-12 w-12 mb-2" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFavicon(e.target.files[0])}
            className="block w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Header Logo</label>
          {headerLogoPreview && (
            <img src={headerLogoPreview} alt="Header Logo Preview" className="h-16 mb-2" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHeaderLogo(e.target.files[0])}
            className="block w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Breadcrumb Image</label>
          {breadcrumbPreview && (
            <img src={breadcrumbPreview} alt="Breadcrumb Preview" className="h-16 mb-2" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBreadcrumbImage(e.target.files[0])}
            className="block w-full"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default BasicInformation;
