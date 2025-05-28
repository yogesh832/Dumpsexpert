import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import popularDumps from "../../data/popularDumps.json";
import CarouselCard from "../ui/CarouselCard";

const PopularDumps = () => {
  // Handler for the card button click (you can customize)
  const handleLearnMore = (dump) => {
    // For example, you could route to a detail page or open a modal
    alert(`Learn more about ${dump.title} (${dump.code})`);
  };

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
            <CarouselCard
              title={`${dump.title} (${dump.code})`}
              description={
                <>
                  <p><strong>Updated On:</strong> {dump.updatedOn}</p>
                  <p><strong>Passing Score:</strong> {dump.score}</p>
                  <p><strong>Duration:</strong> {dump.duration}</p>
                </>
              }
              buttonText="View More"
              onClick={() => handleLearnMore(dump)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularDumps;
