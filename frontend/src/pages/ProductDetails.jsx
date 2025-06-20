import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import dummyProduct from "../assets/dummyProductInfo.json";

const ProductDetails = () => {
  const loading = false; // Simulate loading if needed
  const product = dummyProduct;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen mt-28 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 px-6 md:px-20 mb-20">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Carousel */}
        <div className="w-full md:w-1/2">
          <Swiper
            spaceBetween={10}
            navigation
            modules={[Navigation, Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            className="rounded-lg border mb-4"
          >
            {product.imageUrls.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`product-${index}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Swiper */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            className="mt-2"
          >
            {product.imageUrls.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`thumb-${index}`}
                  className="w-full h-20 object-cover border rounded hover:scale-105 transition-transform"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-start gap-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl text-blue-600 font-semibold">₹ {product.price}</p>
          <p className="text-gray-700">{product.description}</p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all w-fit">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        {product.reviews?.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="font-semibold">{review.user}</span>
                  <span className="text-yellow-500">Rating: {review.rating}/5</span>
                </div>
                <p className="text-gray-700 mt-1">{review.comment}</p>
                <span className="text-sm text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Write Review Form */}
      <div className="mt-16 border p-6 rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <form className="grid gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 rounded outline-blue-400"
          />
          <textarea
            placeholder="Your review"
            rows="4"
            className="border p-3 rounded outline-blue-400"
          ></textarea>
          <button
            type="submit"
            className="w-fit px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
