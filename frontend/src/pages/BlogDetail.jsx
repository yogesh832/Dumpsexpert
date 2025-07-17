import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/blogs/slug/${slug}`);
        if (res.data?.success === false) {
          toast.error(res.data.message || "Something went wrong");
        } else {
          setBlog(res.data?.data || null);
        }
      } catch (error) {
        console.error("❌ Error fetching blog:", error);
        toast.error(error?.response?.data?.message || "Internal server error");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [slug]);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/blogs/all`);
        const allBlogs = res.data?.data || [];
        const publishedBlogs = allBlogs
          .filter((b) => b.status === "publish" && b.slug !== slug)
          .slice(0, 5);
        setRecentBlogs(publishedBlogs);
      } catch (err) {
        console.error("❌ Error fetching other blogs:", err);
      }
    };

    fetchRecentBlogs();
  }, [slug]);

  if (loading) return <p className="text-center py-10">Loading blog...</p>;
  if (!blog) return <p className="text-center py-10 text-red-500">Blog not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-34 grid grid-cols-1 md:grid-cols-3 gap-10">
      
      {/* Left: Blog Content */}
      <div className="md:col-span-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{blog.title}</h1>

        <div className="text-sm text-gray-500 mb-6">
          Published on{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-80 object-cover rounded mb-6"
          />
        )}

        <div
          className="prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-10 border-t pt-4 text-sm text-gray-500 space-y-2">
          <p><strong>Category:</strong> {blog.category}</p>
          <p><strong>Language:</strong> {blog.language}</p>
          {blog.metaKeywords && (
            <p><strong>Tags:</strong> {blog.metaKeywords}</p>
          )}
        </div>
      </div>

      {/* Right: Other Blogs */}
      {recentBlogs.length > 0 && (
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Other Blogs</h2>
          <div className="space-y-6">
            {recentBlogs.map((b) => (
              <Link
                key={b._id}
                to={`/blogs/${b.slug}`}
                className="block border rounded-lg overflow-hidden shadow hover:shadow-md transition duration-200"
              >
                {b.imageUrl && (
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-3">
                  <h3 className="text-md font-semibold mb-1 line-clamp-2">{b.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {new Date(b.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <span className="text-sm text-blue-600 hover:underline">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
