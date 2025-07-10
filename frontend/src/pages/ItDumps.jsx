import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { instance } from "../lib/axios";

const ITDumps = () => {
  const [dumpsData, setDumpsData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen w-full mt-28">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-10">
            {dumpsData.map((item) => (
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
        </div>
      )}
    </div>
  );
};

export default ITDumps;
