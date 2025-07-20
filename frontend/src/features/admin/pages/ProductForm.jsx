import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ProductForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sapExamCode: "",
    title: "",
    price: "",
    category: "",
    status: "",
    action: "",
    image: null,
    samplePdf: null,
    mainPdf: null,
    dumpsPriceInr: "",
    dumpsPriceUsd: "",
    dumpsMrpInr: "",
    dumpsMrpUsd: "",
    comboPriceInr: "",
    comboPriceUsd: "",
    comboMrpInr: "",
    comboMrpUsd: "",
    sku: "",
    longDescription: "",
    Description: "",
    slug: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    schema: "",
  });

  const [existingFiles, setExistingFiles] = useState({
    imageUrl: "",
    samplePdfUrl: "",
    mainPdfUrl: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/product-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (mode === "edit" && id) {
      fetch(`http://localhost:8000/api/products/${id}`)
        .then((res) => res.json())
        .then((res) => {
          const p = res.data;
          setForm((prev) => ({
            ...prev,
            ...p,
            image: null,
            samplePdf: null,
            mainPdf: null,
          }));
          setExistingFiles({
            imageUrl: p.imageUrl,
            samplePdfUrl: p.samplePdfUrl,
            mainPdfUrl: p.mainPdfUrl,
          });
        });
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (["image", "samplePdf", "mainPdf"].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
   const res = await fetch(
  mode === "add"
    ? "http://localhost:8000/api/products"
    : `http://localhost:8000/api/products/${id}`,
  {
    method: mode === "add" ? "POST" : "PUT",
    body: formData,
    credentials: "include", // ✅ This is required!
  }
);



      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Something went wrong");
      }

      navigate("/admin/products/list");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("Delete this product?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      navigate("/admin/products/list");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {mode === "add" ? "Add Product" : "Edit Product"}
      </h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="sapExamCode"
          value={form.sapExamCode}
          onChange={handleChange}
          placeholder="Exam Code"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          required
          className="border w-full px-3 py-2 rounded"
        />

        <h3 className="font-semibold mt-4">Dumps Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="dumpsPriceInr"
            placeholder="Dumps Price INR"
            value={form.dumpsPriceInr}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
          <input
            name="dumpsPriceUsd"
            placeholder="Dumps Price USD"
            value={form.dumpsPriceUsd}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
          <input
            name="dumpsMrpInr"
            placeholder="Dumps MRP INR"
            value={form.dumpsMrpInr}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
          <input
            name="dumpsMrpUsd"
            placeholder="Dumps MRP USD"
            value={form.dumpsMrpUsd}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
        </div>

        <h3 className="font-semibold mt-4">Combo Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="comboPriceInr"
            placeholder="Combo Price INR"
            value={form.comboPriceInr}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
          <input
            name="comboPriceUsd"
            placeholder="Combo Price USD"
            value={form.comboPriceUsd}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
          <input
            name="comboMrpInr"
            placeholder="Combo MRP INR"
            value={form.comboMrpInr}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
          <input
            name="comboMrpUsd"
            placeholder="Combo MRP USD"
            value={form.comboMrpUsd}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          />
        </div>

        <input
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
          className="border w-full px-3 py-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          name="action"
          value={form.action}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Action</option>
          <option value="edit">Edit</option>
          <option value="review">Review</option>
        </select>

        {/* File Uploads */}
        <div>
          <label>Product Image</label>
          {mode === "edit" && existingFiles.imageUrl && (
            <img src={existingFiles.imageUrl} alt="" className="w-32 mb-2" />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            {...(mode === "add" && { required: true })}
          />
        </div>

        <div>
          <label>Sample PDF</label>
          {mode === "edit" && existingFiles.samplePdfUrl && (
            <a href={existingFiles.samplePdfUrl} target="_blank" rel="noreferrer">
              View Existing
            </a>
          )}
          <input
            type="file"
            name="samplePdf"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label>Main PDF</label>
          {mode === "edit" && existingFiles.mainPdfUrl && (
            <a href={existingFiles.mainPdfUrl} target="_blank" rel="noreferrer">
              View Existing
            </a>
          )}
          <input
            type="file"
            name="mainPdf"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* CKEditor for descriptions */}
        <div>
          <label className="block mb-1">Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={form.Description}
            onChange={(_, editor) =>
              setForm((prev) => ({ ...prev, Description: editor.getData() }))
            }
          />
        </div>

        <div>
          <label className="block mb-1">Long Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={form.longDescription}
            onChange={(_, editor) =>
              setForm((prev) => ({ ...prev, longDescription: editor.getData() }))
            }
          />
        </div>

        {/* SEO Fields */}
        
        <input
          name="metaTitle"
          placeholder="Meta Title"
          value={form.metaTitle}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
        <textarea
          name="metaKeywords"
          placeholder="Meta Keywords"
          value={form.metaKeywords}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
        <textarea
          name="metaDescription"
          placeholder="Meta Description"
          value={form.metaDescription}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />
        <textarea
          name="schema"
          placeholder="Schema"
          value={form.schema}
          onChange={handleChange}
          className="border w-full px-3 py-2 rounded"
        />

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;