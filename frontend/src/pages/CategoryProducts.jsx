import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { instance } from "../lib/axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance
      .get("/api/products")
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

  return (
    <div className="min-h-screen mt-28 px-4 md:px-10">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold capitalize mb-6">
            {categoryName} Products
          </h1>

          {products.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">SAP Exam. Code</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">SAP Details</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {products.map((product) => (
                    <tr key={product._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{product.sapExamCode}</td>
                      <td className="px-4 py-3">{product.title}</td>
                      <td className="px-4 py-3">₹ {product.price}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/product/${product._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
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


        </>
      )}
    </div>
  );
};

export default CategoryProducts;
