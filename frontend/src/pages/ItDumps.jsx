import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { instance } from "../lib/axios";

const ITEMS_PER_PAGE = 12;

const ITDumps = () => {
  const [dumpsData, setDumpsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    instance
      .get("/api/product-categories")
      .then((res) => {
        setDumpsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Total pages based on items
  const totalPages = Math.ceil(dumpsData.length / ITEMS_PER_PAGE);

  // Memoized current page data
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return dumpsData.slice(start, end);
  }, [dumpsData, currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen w-full mt-28">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-10">
            {currentData.map((item) => (
              <Link
                to={`/courses/${item.name.toLowerCase()}`}
                key={item._id}
                className="border p-4 rounded shadow hover:shadow-md transition-all"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full object-cover rounded"
                />
                <h2 className="mt-2 text-center font-semibold capitalize">
                  {item.name}
                </h2>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ITDumps;
