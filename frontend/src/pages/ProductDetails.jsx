import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useCartStore from "../store/useCartStore";
import { FaCheckCircle, FaChevronDown, FaChevronRight, FaStar, FaUser } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ProductDetails = () => {
    const { slug } = useParams();

  // const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", comment: "", rating: 0 });

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productRes } = await axios.get(
          `http://localhost:8000/api/products/slug/${slug}`
        );
        setProduct(productRes.data);
console.log(product);
        const reviewsRes = await axios.get(`http://localhost:8000/api/reviews/${productRes.data._id}`);
        setReviews(reviewsRes.data);

        const [examsRes, allProductsRes] = await Promise.all([
          axios.get(
            `http://localhost:8000/api/exams/byProduct/${productRes.data._id}`
          ),
          axios.get("http://localhost:8000/api/products"),
        ]);

        setExams(examsRes.data[0]); // Expected to be an array
        console.log("exams", examsRes.data[0]);

        const related = allProductsRes.data.data.filter(
          (p) => p._id !== productRes.data._id
        );
        setRelatedProducts(related);
      } catch (error) {
        toast.error("Failed to load product details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const handleDownload = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch {
      toast.error("Failed to download.");
    }
  };

  const handleAddToCart = (type = "regular") => {
    setIsAdding(true);
    let item = {
      ...product,
      type,
      imageUrl: product.imageUrl,
      samplePdfUrl: product.samplePdfUrl,
      mainPdfUrl: product.mainPdfUrl,
    };

    // Set title and price based on package type
    switch (type) {
      case "regular":
        item.title = `${product.title} [PDF]`;
        item.price = product.dumpsPriceInr || product.dumpsPriceUsd;
        break;
      case "online":
        item.title = `${product.title} [Online Exam]`;
        item.price = exams.priceINR || exams.priceUSD;
        break;
      case "combo":
        item.title = `${product.title} [Combo]`;
        item.price = product.comboPriceInr || product.comboPriceUsd;
        break;
      default:
        item.title = product.title;
        item.price = product.dumpsPriceInr || product.dumpsPriceUsd;
    }

    console.log('Adding to cart:', item); // Debug log
    addToCart(item);
    toast.success("Added to cart!");
    setTimeout(() => setIsAdding(false), 1000);
  };

  const calculateDiscount = (mrp, price) => {
    if (!mrp || !price || mrp <= price) return 0;
    const discount = ((mrp - price) / mrp) * 100;
    return Math.round(discount);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`http://localhost:8000/api/reviews/${product._id}`, reviewForm);
      toast.success("Review submitted!");
      setReviewForm({ name: "", comment: "", rating: 0 });
      setReviews((prev) => [data.review, ...prev]);
    } catch (err) {
      toast.error("Failed to submit review.");
      console.error(err);
    }
  };

  const handleRating = (value) => {
    setReviewForm({ ...reviewForm, rating: value });
  };



    const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };


  if (loading || !product) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white py-34 px-4 md:px-20 text-gray-800">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-[40%]">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full rounded-xl object-contain shadow-md max-h-[400px]"
          />

          {/* Feature list UI */}
          <div className="flex flex-row flex-wrap justify-center gap-8 bg-white border border-gray-200 shadow-sm rounded-xl px-6 py-5 mt-8 max-w-4xl mx-auto text-gray-900 text-sm sm:text-base font-medium">
            <div className="flex flex-col gap-3 min-w-[220px]">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 text-xl" />
                <span>Instant Download After Purchase</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 text-xl" />
                <span>100% Real & Updated Dumps</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 text-xl" />
                <span>100% Money Back Guarantee</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[220px]">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 text-xl" />
                <span>90 Days Free Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 text-xl" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-[60%] space-y-2">
          <h1 className="text-3xl font-bold">{product.title || "N/A"}</h1>

          <p className="text-sm">
            Exam Code: <strong>{product.sapExamCode || "N/A"}</strong>
          </p>

          <p className="text-sm">
            Category: <strong>{product.category ? product.category.toUpperCase() : "N/A"}</strong>
          </p>
          {exams && exams._id && (
            <>
              <p className="text-sm">
                Exam Duration: <strong>{exams?.duration ?? "N/A"}</strong> Minutes
              </p>

              <p className="text-sm">
                Total Questions: <strong>{exams?.numberOfQuestions ?? "N/A"}</strong>
              </p>

              <p className="text-sm">
                Passing Score: <strong>{exams?.passingScore ?? "N/A"}</strong>%
              </p>
            </>
          )}
          <p className="text-sm">
            Updated on:{" "}
            {product.updatedAt
              ? new Date(product.updatedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "N/A"}
          </p>

  {/* Online Exam */}
  {/* {exams && exams._id && (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold">Online Exam Questions</p>
        <p className="text-blue-600 font-bold">
          ₹ <span>{exams.priceINR ?? "N/A"}</span>{" "}
          <span className="text-red-600 font-bold line-through">
            ₹{exams.mrpINR ?? "N/A"}
          </span>{" "}
          <span className="text-gray-600 font-bold text-sm">
            ({calculateDiscount(exams.mrpINR, exams.priceINR)}% off)
          </span>
        </p>
        <p>
          ${" "}
          <span className="text-blue-400 font-bold">
            {exams.priceUSD ?? "N/A"}
          </span>{" "}
          <span className="text-red-400 font-bold line-through">
            ${exams.mrpUSD ?? "N/A"}
          </span>{" "}
          <span className="text-gray-400 font-bold text-sm">
            ({calculateDiscount(exams.mrpUSD, exams.priceUSD)}% off)
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/student/courses-exam/sample-instructions/${exams._id}`)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Try Online Exam
        </button>
        <button
          onClick={() => handleAddToCart("regular")}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-4 py-2 rounded"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  )} */}
          {/* Pricing & buttons */}
          <div className="mt-4 space-y-4">
            {/* Regular PDF */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Downloadable File</p>
                <p className="text-blue-600 font-bold">
                  ₹{product.dumpsPriceInr ?? "N/A"}
                  <span className="text-red-500 ml-2 line-through">
                    ₹{product.dumpsMrpInr ?? "N/A"}
                  </span>{" "}
                  <span className="text-gray-600 text-sm">
                    ({calculateDiscount(product.dumpsMrpInr, product.dumpsPriceInr)}% off)
                  </span>
                </p>
                <p>
                  ${" "}
                  <span className="text-blue-400 font-bold">
                    {product.dumpsPriceUsd ?? "N/A"}
                  </span>{" "}
                  <span className="text-red-400 font-bold line-through">
                    ${product.dumpsMrpUsd ?? "N/A"}
                  </span>{" "}
                  <span className="text-gray-400 font-bold text-sm">
                    ({calculateDiscount(product.dumpsMrpUsd, product.dumpsPriceUsd)}% off)
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {product.samplePdfUrl && (
                  <button
                    onClick={() =>
                      handleDownload(
                        product.samplePdfUrl,
                        `${product.title}-Sample.pdf`
                      )
                    }
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                  >
                    Download Sample
                  </button>
                )}
                <button
                  onClick={() => handleAddToCart("regular")}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-4 py-2 rounded"
                  disabled={isAdding}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>

            {/* Online Exam */}
            {exams && exams._id && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Online Exam Questions</p>
                  <p className="text-blue-600 font-bold">
                    ₹ <span>{exams.priceINR ?? "N/A"}</span>{" "}
                    <span className="text-red-600 font-bold line-through">
                      ₹{exams.mrpINR ?? "N/A"}
                    </span>{" "}
                    <span className="text-gray-600 font-bold text-sm">
                      ({calculateDiscount(exams.mrpINR, exams.priceINR)}% off)
                    </span>
                  </p>
                  <p>
                    ${" "}
                    <span className="text-blue-400 font-bold">
                      {exams.priceUSD ?? "N/A"}
                    </span>{" "}
                    <span className="text-red-400 font-bold line-through">
                      ${exams.mrpUSD ?? "N/A"}
                    </span>{" "}
                    <span className="text-gray-400 font-bold text-sm">
                      ({calculateDiscount(exams.mrpUSD, exams.priceUSD)}% off)
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/student/test/${exams._id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Try Online Exam
                  </button>
                  <button
                    onClick={() => handleAddToCart("online")}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-4 py-2 rounded"
                    disabled={isAdding}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            )}

            {/* Combo */}
            {exams && exams._id && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Get Combo (PDF + Online Exam)</p>
                  <p className="text-blue-600 font-bold">
                    ₹ <span>{product.comboPriceInr ?? "N/A"}</span>{" "}
                    <span className="text-red-600 font-bold line-through">
                      ₹{product.comboMrpInr ?? "N/A"}
                    </span>{" "}
                    <span className="text-gray-600 font-bold text-sm">
                      ({calculateDiscount(product.comboMrpInr, product.comboPriceInr)}% off)
                    </span>
                  </p>
                  <p>
                    ${" "}
                    <span className="text-blue-400 font-bold">
                      {product.comboPriceUsd ?? "N/A"}
                    </span>{" "}
                    <span className="text-red-400 font-bold line-through">
                      ${product.comboMrpUsd ?? "N/A"}
                    </span>{" "}
                    <span className="text-gray-400 font-bold text-sm">
                      ({calculateDiscount(product.comboMrpUsd, product.comboPriceUsd)}% off)
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToCart("combo")}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-4 py-2 rounded"
                    disabled={isAdding}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Description:</h2>
            {product.Description ? (
              <div
                className="prose max-w-none text-sm text-gray-800"
                dangerouslySetInnerHTML={{ __html: product.Description }}
              />
            ) : (
              <p className="text-sm text-gray-600">No description available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Long Description */}
      <div className="my-10">
        <h2 className="text-lg font-semibold mb-2">Detailed Overview:</h2>
        {product.longDescription ? (
          <div
            className="prose max-w-none text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: product.longDescription }}
          />
        ) : (
          <p className="text-sm text-gray-600">No additional information.</p>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            navigation
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="relative"
          >
            {relatedProducts.map((item) => (
              <SwiperSlide key={item._id}>
                <div
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-white border rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-36 object-contain w-full rounded mb-2"
                  />
                  <h3 className="text-sm font-semibold truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹ {item.dumpsPriceInr}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* User Reviews */}
      {reviews.length > 0 && (
        <div className="mt-10 max-w-xl">
          <h3 className="text-lg font-semibold mb-4">User Reviews</h3>
          <ul className="space-y-4">
            {reviews.map((r, i) => (
              <li key={i} className="border rounded p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={`text-sm ${idx < r.rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="font-medium">{r.name}</p>
                <p className="text-gray-600 text-sm">{r.comment}</p>
                <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Review Form */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        <form className="grid gap-3 max-w-xl" onSubmit={handleSubmitReview}>
          <input
            name="name"
            value={reviewForm.name}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, name: e.target.value })
            }
            placeholder="Your name"
            className="border p-3 rounded"
          />
          <textarea
            name="comment"
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm({ ...reviewForm, comment: e.target.value })
            }
            placeholder="Your comment"
            rows="4"
            className="border p-3 rounded"
          />

          {/* Star Rating UI */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaStar
                key={value}
                onClick={() => handleRating(value)}
                className={`cursor-pointer text-2xl ${
                  value <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600">
              {reviewForm.rating > 0 ? `${reviewForm.rating} Star(s)` : "Rate us"}
            </span>
          </div>


      {/* Review */}
       <div className="mt-16 ">
      <h2 className="text-xl  font-semibold mb-4">Write a Review</h2>
      <form className="grid gap-3 max-w-xl" onSubmit={handleSubmitReview}>
        <input
          name="name"
          value={reviewForm.name}
          onChange={(e) =>
            setReviewForm({ ...reviewForm, name: e.target.value })
          }
          placeholder="Your name"
          className="border p-3 rounded"
        />
        <textarea
          name="comment"
          value={reviewForm.comment}
          onChange={(e) =>
            setReviewForm({ ...reviewForm, comment: e.target.value })
          }
          placeholder="Your comment"
          rows="4"
          className="border p-3 rounded"
        />

        {/* Star Rating UI */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <FaStar
              key={value}
              onClick={() => handleRating(value)}
              className={`cursor-pointer text-2xl ${
                value <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600">
            {reviewForm.rating > 0 ? `${reviewForm.rating} Star(s)` : "Rate us"}
          </span>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </form>
    </div>
{/* FAQ Section */}
{product.faqs && product.faqs.length > 0 && (
  <div className="max-w-4xl mx-auto mt-12">
    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
      <FaUser className="text-blue-600" /> Frequently Asked Questions (FAQs)
    </h2>

    <div className="space-y-4">
      {product.faqs.map((faq, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className="border border-gray-200 rounded-xl shadow-sm transition-all duration-300 bg-white"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left group hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800 text-base">{faq.question}</span>
              <FaChevronRight
                className={`text-gray-600 transition-transform duration-300 transform ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            <div
              className={`px-6 overflow-hidden text-gray-600 text-sm transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 py-2" : "max-h-0 py-0"
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}



          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;