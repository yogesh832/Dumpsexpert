import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Button from "../ui/Button";
import axios from "axios";

const PopularDumps = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPopularDumps = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/products");
        const fetchedProducts = res?.data?.data;

        if (Array.isArray(fetchedProducts)) {
          setProducts(fetchedProducts);
        } else {
          setProducts([]);
          console.error("Expected 'data' to be array but got:", typeof fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchPopularDumps();
  }, []);

  // Calculate yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toISOString().split("T")[0]; // e.g., "2025-07-17"

  return (
    <section className="py-12 px-4 md:px-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        Most Popular IT Certification Exam Dumps
      </h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {products.map((dump, index) => (
          <SwiperSlide key={dump._id || index}>
            <div className="border border-gray-200 rounded-lg p-6 bg-white text-center shadow hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-between">
              <div className="mb-4">
                <img src={dump.imageUrl} className="w-full h-40" alt="" />
                <h3 className="font-semibold pt-4 text-sm text-orange-900 mb-2">
                  ({dump.sapExamCode})
                </h3>
                <p className="text-sm text-gray-800 mb-3">{dump.title}</p>
                <p className="text-sm text-gray-600">
                  <strong>Updated On:</strong> {formattedDate}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {dump.category}
                </p>
               
              </div>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded px-4 py-2 text-sm mt-4"
                onClick={() => window.location.href = `/product/${dump.slug || dump._id}`}
              >
                View More
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularDumps;
