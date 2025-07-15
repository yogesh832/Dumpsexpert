import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { instance } from "../lib/axios";
import { FaCheckCircle } from "react-icons/fa";
import guarantee from "../assets/userAssets/guaranteed.png";

const ITDumps = () => {
  const [dumpsData, setDumpsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await instance.get("/api/product-categories");
        setDumpsData(res.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="relative min-h-screen w-full pt-34 pb-10 px-4 md:px-8"
      style={{
        backgroundImage: `url(${guarantee})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-0" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <LoadingSpinner />
          </div>
        ) : dumpsData.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No dumps found.</div>
        ) : (
          <>
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-8">
              Unlock Your Potential with IT Certification Dumps
            </h1>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center max-w-2xl mx-auto mb-10 text-gray-900 text-sm sm:text-base font-medium">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600 text-xl" />
                  Instant Download After Purchase
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600 text-xl" />
                  100% Real & Updated Dumps
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600 text-xl" />
                  100% Money Back Guarantee
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600 text-xl" />
                  90 Days Free Updates
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-blue-600 text-xl" />
                  24/7 Customer Support
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            {/* Cards Flexbox Layout - 5 per row max */}
            <div className="flex flex-wrap py-10 justify-center gap-4">
              {dumpsData.map((item) => (
                <Link
                  to={`/courses/${item.name.toLowerCase()}`}
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all flex flex-col items-center text-center overflow-hidden w-[160px] sm:w-[170px] md:w-[180px] lg:w-[180px]"
                >
                  <div className="h-28 md:h-32 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="px-2 pb-3">
                    <h3 className="text-sm sm:text-base font-medium capitalize text-gray-800 truncate">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ITDumps;
