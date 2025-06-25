import React, { useState } from "react";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import dummyProduct from "../assets/dummyProductInfo.json";
import useCartStore from "../store/useCartStore";

const ProductDetails = () => {
  const loading = false; // Simulate loading if needed
  const product = dummyProduct;
  const addToCart = useCartStore(state => state.addToCart);
  const [isAdding, setIsAdding] = useState(false);

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
        {/* Product Image */}
        <div className="w-full md:w-[40%]">
          {product.imageUrls.length > 0 && (
            <img
              src={product.imageUrls[0]}
              alt="product"
              className="w-full h-72 object-cover rounded-lg" // reduced height from h-96 to h-72
            />
          )}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-[60%] flex flex-col justify-start gap-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl text-blue-600 font-semibold">₹ {product.price}</p>
          <p className="text-gray-700">{product.description}</p>
          <button 
            className={`mt-4 px-6 py-2 ${isAdding ? 'bg-green-600' : 'bg-blue-600'} text-white rounded hover:bg-blue-700 transition-all w-fit flex items-center gap-2`}
            onClick={() => {
              setIsAdding(true);
              addToCart(product);
              toast.success('Added to cart!');
              setTimeout(() => setIsAdding(false), 1000);
            }}
            disabled={isAdding}
          >
            {isAdding ? 'Added ✓' : 'Add to Cart'}
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
