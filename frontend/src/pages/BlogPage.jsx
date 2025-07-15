import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { instance } from "../lib/axios";
import { Link } from "react-router";

const BlogPage = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await instance.get("/api/blog-categories");
        setBlogsData(res.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen w-full pt-34 pb-10 px-4 md:px-8">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <LoadingSpinner />
          </div>
        ) : blogsData.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No blogs found.</div>
        ) : (
          <>
            {/* Blog Section Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4">
              Explore Top IT Certification Blog Categories
            </h1>

            {/* Intro Paragraph */}
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-sm sm:text-base">
              Stay informed with the latest updates, tips, and strategies on IT certifications. Whether you're preparing for your next exam or exploring new certifications, our blog categories help you navigate your learning journey.
            </p>

            {/* Category Cards */}
            <div className="flex flex-wrap py-10 justify-center gap-4">
              {blogsData.map((item) => (
                <Link
                  to={`/blogs/category/${item.category.name.toLowerCase()}`}
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all flex flex-col items-center text-center overflow-hidden w-[160px] sm:w-[170px] md:w-[180px] lg:w-[180px]"
                >
                  <div className="h-28 md:h-32 w-full overflow-hidden">
                    <img
                      src={item.category.image}
                      alt={item.category.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="px-2 pb-3">
                    <h3 className="text-sm sm:text-base font-medium capitalize text-gray-800 truncate">
                      {item.category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
