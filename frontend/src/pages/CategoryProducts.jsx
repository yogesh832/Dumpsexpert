import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
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
    <div className="min-h-screen mt-28 px-10">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold capitalize mb-6">
            {categoryName} Products
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="border p-4 rounded shadow hover:shadow-md transition-all"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-32 object-cover rounded"
                />
                <h2 className="mt-2 font-semibold">{product.title}</h2>
                <p className="text-gray-600">₹ {product.price}</p>
              </Link>
            ))}

            {products.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No products available for this category.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryProducts;
