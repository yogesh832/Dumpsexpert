import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const CouponForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  // Load existing coupon for edit
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/coupons/${id}`
        );
        setForm({
          name: data.name,
          discount: data.discount,
          startDate: data.startDate.slice(0, 10),
          endDate: data.endDate.slice(0, 10),
        });
      } catch (err) {
        console.error("Failed to load coupon:", err);
      }
    };

    if (id) fetchCoupon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "discount" ? Number(value) : value,
    }));
  };

  // CouponForm.jsx (only relevant part shown)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name.trim().toUpperCase(),
        discount: Number(form.discount),
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      };

      if (id) {
        await axios.put(`http://localhost:8000/api/coupons/${id}`, payload);
      } else {
        await axios.post(`http://localhost:8000/api/coupons`, payload);
      }

      navigate("/admin/coupons/list");
    } catch (error) {
      console.error("Error saving coupon", error);
      alert(error.response?.data?.error || "Failed to save coupon");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {id ? "Edit Coupon" : "Add Coupon"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 shadow rounded"
      >
        <input
          type="text"
          name="name"
          placeholder="Coupon Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount %"
          value={form.discount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div className="text-right">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
