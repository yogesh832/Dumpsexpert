import { useState } from "react";

const OrdersRejected = () => {
  const orders = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    customer: `RejectedUser ${i + 1}`,
    date: `2025-06-${(i % 28) + 1}`.padStart(10, "0"),
    total: `$${(30 + i * 4).toFixed(2)}`
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Rejected Orders</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id}>
              <td className="px-4 py-2 border">{order.id}</td>
              <td className="px-4 py-2 border">{order.customer}</td>
              <td className="px-4 py-2 border">{order.date}</td>
              <td className="px-4 py-2 border">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center space-x-2">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {idx + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="px-3 py-1 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
};

export default OrdersRejected;
