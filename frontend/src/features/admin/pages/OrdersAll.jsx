import { useState } from "react";

const OrdersAll = () => {
  const orders = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    customer: `Customer ${i + 1}`,
    status: ["Completed", "Pending", "Rejected"][i % 3],
    date: `2025-06-${(i % 30) + 1}`.padStart(10, "0"),
    total: `$${(100 + i * 10).toFixed(2)}`
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id}>
              <td className="px-4 py-2 border">{order.id}</td>
              <td className="px-4 py-2 border">{order.customer}</td>
              <td className="px-4 py-2 border">{order.date}</td>
              <td className="px-4 py-2 border">{order.status}</td>
              <td className="px-4 py-2 border">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            } hover:bg-gray-300`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersAll;
