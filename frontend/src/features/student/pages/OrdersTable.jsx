
import React, { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";

const orders = [
  { id: 1, date: "2025-06-01", number: "#ORD123", total: 500, quantity: 2, status: "Paid" },
  { id: 2, date: "2025-06-02", number: "#ORD124", total: 300, quantity: 1, status: "Fail" },
  { id: 3, date: "2025-06-03", number: "#ORD125", total: 450, quantity: 3, status: "Paid" },
  { id: 4, date: "2025-06-04", number: "#ORD126", total: 250, quantity: 1, status: "Paid" },
  { id: 5, date: "2025-06-05", number: "#ORD127", total: 350, quantity: 2, status: "Fail" },
  { id: 6, date: "2025-06-06", number: "#ORD128", total: 300, quantity: 1, status: "Paid" },
  { id: 7, date: "2025-06-07", number: "#ORD129", total: 600, quantity: 4, status: "Paid" },
  { id: 8, date: "2025-06-08", number: "#ORD130", total: 700, quantity: 5, status: "Fail" },
  { id: 9, date: "2025-06-09", number: "#ORD131", total: 500, quantity: 3, status: "Paid" },
  { id: 10, date: "2025-06-10", number: "#ORD132", total: 200, quantity: 1, status: "Fail" },
  { id: 11, date: "2025-06-11", number: "#ORD133", total: 650, quantity: 4, status: "Paid" },
  { id: 12, date: "2025-06-12", number: "#ORD134", total: 450, quantity: 2, status: "Fail" },
];
const OrdersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="overflow-x-auto bg-white p-6 shadow rounded-lg relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">My Orders</h3>
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded-md w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="min-w-full text-sm border rounded-md">
        <thead className="bg-gray-200 text-left text-sm font-semibold">
          <tr>
            <th className="p-2 border">Sr. No.</th>
            <th className="p-2 border">Order Date</th>
            <th className="p-2 border">Order Number</th>
            <th className="p-2 border">Total (₹)</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Payment Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, index) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="p-2 border">{order.date}</td>
              <td className="p-2 border">{order.number}</td>
              <td className="p-2 border">₹{order.total}</td>
              <td className="p-2 border">{order.quantity}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    order.status === "Paid" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center text-sm">
        <span>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} entries
        </span>
        <div className="space-x-2">
          <button
            onClick={handlePrevious}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersTable;
