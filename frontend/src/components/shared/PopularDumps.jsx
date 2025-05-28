import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import popularDumps from "../../data/popularDumps.json";
import Button from "../ui/Button";

const PopularDumps = () => {
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
        {popularDumps.map((dump, index) => (
    <SwiperSlide key={index}>
  <div className="border border-gray-200 rounded-lg p-6 bg-white text-center shadow hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-between">
    <div className="mb-4">
      <h3 className="font-semibold text-sm text-orange-900 mb-2">
        ({dump.code})
      </h3>
      <p className="text-sm text-gray-800 mb-3">{dump.title}</p>
      <p className="text-sm text-gray-600">
        <strong>Updated On:</strong> {dump.updatedOn}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Passing Score:</strong> {dump.score}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Duration:</strong> {dump.duration}
      </p>
    </div>
    <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded px-4 py-2 text-sm mt-4">
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
