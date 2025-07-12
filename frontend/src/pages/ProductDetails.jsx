import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useCartStore from "../store/useCartStore";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", comment: "" });

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProductAndExams = async () => {
      try {
        const productRes = await axios.get(
          `https://dumpsexpert-2.onrender.com/api/products/${id}`
        );
        const fetchedProduct = productRes.data.data;
        setProduct(fetchedProduct);

        const examsRes = await axios.get(
          `https://dumpsexpert-2.onrender.com/api/exams`
        );
        const linkedExams = examsRes.data.filter(
          (exam) => exam.productId === fetchedProduct._id
        );
        setExams(linkedExams);

        const allProductsRes = await axios.get(
          "https://dumpsexpert-2.onrender.com/api/products"
        );
        setRelatedProducts(allProductsRes.data.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product or exams:", err);
        toast.error("Failed to load data.");
        setLoading(false);
      }
    };

    if (id) fetchProductAndExams();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      toast.error("Please fill out all fields.");
      return;
    }
    toast.success("Review submitted!");
    setReviewForm({ name: "", comment: "" });
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen mt-34 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 md:px-20 pb-20 bg-white">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-[40%]">
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt="product"
            className="rounded-xl shadow-md w-full object-contain max-h-[400px]"
          />
        </div>

        <div className="w-full md:w-[60%] space-y-2 text-sm sm:text-base">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {product.title}
          </h1>

          <ul className="mt-4 space-y-1 text-gray-800">
            <li>
              <strong>Exam Code:</strong> {product.sapExamCode}
            </li>
            <li>
              <strong>Exam Name:</strong> {product.title}
            </li>
            <li>
              <strong>Total Questions:</strong> 80
            </li>
            <li>
              <strong>Passing Score:</strong> 73%
            </li>
            <li>
              <strong>Duration:</strong> 180 Minutes
            </li>
            <li>
              <strong>Last Updated:</strong>{" "}
              {new Date(product.updatedAt).toDateString()}
            </li>
          </ul>

          <div className="mt-4 text-lg font-semibold">
            <span className="text-blue-600 text-xl font-bold">
              ₹ {product.price}
            </span>
            <span className="line-through text-gray-500 ml-2">₹ 6000.00</span>
            <span className="text-green-600 ml-2 text-sm">(33% off)</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <button className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm rounded shadow-sm">
              Download Sample
            </button>

            <button
              onClick={() => {
                setIsAdding(true);
                addToCart(product);
                toast.success("Added to cart!");
                setTimeout(() => setIsAdding(false), 1000);
              }}
              disabled={isAdding}
              className={`px-6 py-2 text-sm rounded shadow-md text-white font-semibold ${
                isAdding ? "bg-green-600" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {isAdding ? "Added ✓" : "🛒 Go to Cart"}
            </button>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-base">Description:</h2>
            <p className="text-gray-700 mt-1">
              Dumpsxpert Provides 100% updated SAP Project Manager - SAP
              Activate Exam Questions and answers PDF which helps you to Pass
              Your SAP Certification Exam in First Attempt.
            </p>
          </div>

          {/* 🎯 Exam Linked to Product */}
          {exams.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-3">
                📚 Exams Included in this Product:
              </h2>
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="mb-3 p-3 border rounded bg-gray-50"
                >
                  <p>
                    <strong>Name:</strong> {exam.name}
                  </p>
                  <p>
                    <strong>Duration:</strong> {exam.duration} mins
                  </p>
                  <p>
                    <strong>Questions:</strong> {exam.numberOfQuestions}
                  </p>
                  <button
                    onClick={() => navigate(`/student/test/${exam._id}`)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                  >
                    Start Exam
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔁 Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Related Products
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                className="min-w-[180px] w-[200px] bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.title}
                  className="h-36 w-full object-contain mb-3 rounded"
                />
                <h3 className="text-sm font-semibold mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.sapExamCode}</p>
                <p className="text-xs text-gray-600 mt-1">₹ {item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🧾 Customer Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Customer Reviews
        </h2>
        {product.reviews?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-md border shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">
                    {review.user}
                  </span>
                  <span className="text-yellow-500 font-medium">
                    ⭐ {review.rating}/5
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* ✍️ Write a Review */}
      <div className="mt-16 border p-6 rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          Write a Review
        </h3>
        <form className="grid gap-4" onSubmit={handleSubmitReview}>
          <input
            type="text"
            name="name"
            value={reviewForm.name}
            onChange={handleReviewChange}
            placeholder="Your Name"
            className="border p-3 rounded outline-blue-400"
          />
          <textarea
            name="comment"
            value={reviewForm.comment}
            onChange={handleReviewChange}
            placeholder="Your review"
            rows="3"
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
