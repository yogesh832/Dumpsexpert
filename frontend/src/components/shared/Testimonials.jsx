import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import client1 from "../../assets/testimonials/client1.png"; // Adjust path if needed

const testimonials = [
  {
    name: "John Doe",
    title: "IT Specialist",
    feedback:
      "The service was excellent! I highly recommend it to anyone looking for reliable IT certification materials.",
    image: client1,
  },
  {
    name: "John Doe",
    title: "IT Specialist",
    feedback:
      "The service was excellent! I highly recommend it to anyone looking for reliable IT certification materials.",
    image: client1,
  },
  {
    name: "John Doe",
    title: "IT Specialist",
    feedback:
      "The service was excellent! I highly recommend it to anyone looking for reliable IT certification materials.",
    image: client1,
  },
  {
    name: "John Doe",
    title: "IT Specialist",
    feedback:
      "The service was excellent! I highly recommend it to anyone looking for reliable IT certification materials.",
    image: client1,
  },
  {
    name: "John Doe",
    title: "IT Specialist",
    feedback:
      "The service was excellent! I highly recommend it to anyone looking for reliable IT certification materials.",
    image: client1,
  },
];

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-500 py-12 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        What Our Clients Say
      </h2>

      <div className="max-w-5xl mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2000 }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 rounded-md shadow-md h-full flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.title}</p>
                  </div>
                </div>
                <p className="text-gray-800 text-sm">"{item.feedback}"</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
