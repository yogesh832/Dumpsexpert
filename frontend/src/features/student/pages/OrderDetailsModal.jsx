import React, { useEffect, useRef } from "react";
import { FaFileDownload } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

const OrderDetailsModal = ({ order, onClose }) => {
  const modalRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white w-[95%] md:w-[85%] lg:w-[70%] max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl relative border"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-xl"
        >
          <MdOutlineClose />
        </button>

        <h3 className="text-2xl font-semibold mb-6">View Order Details</h3>

        {/* Steps */}
        <div className="flex items-center justify-between mb-6">
          {["Pending", "Processing", "Completed", "Rejected"].map((step, i) => (
            <div key={step} className="flex-1 text-center relative">
              <div
                className={`w-6 h-6 mx-auto mb-1 rounded-full border-2 flex items-center justify-center ${
                  step === order.status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 border-gray-300"
                }`}
              >
                {step === order.status ? "✓" : i + 1}
              </div>
              <p
                className={`text-sm ${
                  step === order.status ? "text-blue-600 font-bold" : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Order Info */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-semibold mb-4">Order Details</h4>
            <div className="space-y-2 text-sm">
              <div>Order Id: <span className="ml-2 text-gray-700">{order.id}</span></div>
              <div className="flex items-center">
                Invoice:{" "}
                <button className="ml-2 px-3 py-1 bg-green-500 text-white text-xs rounded flex items-center gap-1">
                  <FaFileDownload /> Download Invoice
                </button>
              </div>
              <div>
                Payment Status:{" "}
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                  Completed
                </span>
              </div>
              <div>
                Order Status:{" "}
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                  {order.status}
                </span>
              </div>
              <div>SubTotal: {order.subtotal}</div>
              <div>Coupon Discount: {order.discount}</div>
              <div>Paid amount: {order.paid}</div>
              <div>Payment Method: {order.method}</div>
              <div>Transaction Id: {order.transaction}</div>
              <div>Order Date: {order.date}</div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h4 className="text-lg font-semibold mb-4">Billing Details</h4>
            <div className="space-y-2 text-sm">
              <div>Email: <span className="ml-2 text-gray-700">{order.email}</span></div>
              <div>Phone: <span className="ml-2 text-gray-700">{order.phone}</span></div>
              <div>Country: <span className="ml-2 text-gray-700">{order.country}</span></div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Downloadable</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Review</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">1</td>
                <td className="p-2 border">
                  <img src={order.image} alt="Product" className="w-10 h-10 rounded" />
                </td>
                <td className="p-2 border">{order.product}</td>
                <td className="p-2 border space-x-2">
                  <button className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Attempt
                  </button>
                  <button className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Download File
                  </button>
                </td>
                <td className="p-2 border">Video</td>
                <td className="p-2 border">{order.price}</td>
                <td className="p-2 border">
                  <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Reviews
                  </button>
                </td>
                <td className="p-2 border">{order.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
