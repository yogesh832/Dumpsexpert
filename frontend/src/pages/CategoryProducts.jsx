import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { instance } from "../lib/axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    instance
      .get("http://localhost:8000/api/products")
      .then((res) => {
        const filtered = res.data.data.filter(
          (item) => item.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [categoryName]);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sapExamCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-34 pb-12 px-4 md:px-10 bg-[#f3f4f6]">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full max-w-[1280px] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2">
            Latest {categoryName.toUpperCase()} Exam Questions and Answers
            [Updated for 2025]: {categoryName.toUpperCase()} Certification Dumps
          </h1>

          <p className="text-gray-600 my-5 text-lg sm:text-base mb-2">
            {showFullText
              ? `The greatest source for up-to-date ${categoryName} certification dumps is DumpsExpert. For your SAP certification tests, we provide straightforward and easy-to-understand SAP exam questions, with regularly updated content based on the latest exam objectives and formats. Practice makes perfect, and our resources are built to help you succeed with confidence. `
              : ` SAP Certification can be game changer for your career. It opens global Opportunities in high paying job Sector across the world within the areas of information technology, finance, logistics, or supply chain management. At the same time, achieving certification demands dedication and thorough study. If you want to get SAP certification, Dumps Xpert is the best option for you! Dumps xpert Offers you Top quality and up to date SAP certification Questions & Answers PDF  help you to pass your SAP Certification exam. By using our top-notch quality study materials, it becomes Very easy and relaxed for you to take your SAP certification exam. The greatest source for up-to-date ${categoryName} certification dumps is DumpsExpert. For your SAP certification tests, we provide straightforward and easy-to-understand SAP exam questions...`}
          </p>

          <button
            className="text-blue-600 text-sm mb-6 hover:underline"
            onClick={() => setShowFullText(!showFullText)}
          >
            {showFullText ? "Read Less" : "Read More"}
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <p className="text-sm font-medium text-gray-700">
              Showing all {filteredProducts.length} results
            </p>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full sm:w-[400px] bg-white shadow-sm">
              <input
                type="text"
                placeholder="Search Your Exam Code / Exam Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm focus:outline-none"
              />
              <button className="bg-blue-800 text-white px-4 py-2">🔍</button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow text-2xl rounded-lg border border-gray-200">
              <table className="min-w-full text-xl text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xl border-b">
                  <tr>
                    <th className="px-4 py-3">{categoryName} Exam. Code</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">{categoryName} Details</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-semibold text-blue-900 whitespace-nowrap">
                        {product.sapExamCode}
                      </td>
                      <td className="px-4 py-3">{product.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="block text-xs text-gray-600">
                          Starting at:
                        </span>
                        <span className="text-black font-semibold">
                          ₹{product.dumpsPriceInr} (${product.dumpsPriceUsd})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {/* ✅ Link using product.slug instead of _id */}
                        <Link
                          to={`/product/${product.slug}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-4 py-2 rounded-md shadow-sm"
                        >
                          See Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No products available for this category.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
