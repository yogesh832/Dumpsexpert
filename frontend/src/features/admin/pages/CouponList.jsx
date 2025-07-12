import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const navigate = useNavigate();

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(
        "https://dumpsexpert-2.onrender.com/api/coupons"
      );
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons", err);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axios.delete(
        `https://dumpsexpert-2.onrender.com/api/coupons/${id}`
      );
      fetchCoupons(); // refresh list
    } catch (err) {
      console.error("Failed to delete coupon", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Coupon Management</h1>
        <button
          onClick={() => navigate("/admin/coupons/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          + Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-sm font-medium">
              <th className="px-6 py-4 text-left">Coupon Name</th>
              <th className="px-6 py-4 text-left">Discount (%)</th>
              <th className="px-6 py-4 text-left">Start Date</th>
              <th className="px-6 py-4 text-left">End Date</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {coupons.map((coupon) => (
              <tr
                key={coupon._id}
                className="hover:bg-gray-50 transition border-b"
              >
                <td className="px-6 py-4 font-medium">{coupon.name}</td>
                <td className="px-6 py-4">{coupon.discount}%</td>
                <td className="px-6 py-4">
                  {coupon.startDate?.substring(0, 10)}
                </td>
                <td className="px-6 py-4">
                  {coupon.endDate?.substring(0, 10)}
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/coupons/edit/${coupon._id}`)
                    }
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No coupons available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponList;
