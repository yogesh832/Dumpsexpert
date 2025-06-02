// pages/BlogSection.jsx
import React from "react";
import BlogCard from "../ui/BlogCard.jsx";

const blogData = [
  {
    title: "SAP C_AIG_2412 Certification with Expert Preparation",
    description: "Get ready for SAP certification with expert tips, study material, and mock questions.",
    date: "2025-01-27 16:14:21",
    link: "#"
  },
  {
    title: "Mastering AI in SAP Environments",
    description: "Explore AI model development and deployment in SAP using modern tools.",
    date: "2025-02-01 10:00:00",
    link: "#"
  }
];

const BlogSection = () => {
  return (
    <div className="min-h-5xl px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl p-10 text-center font-bold text-gray-800">Latest Blogs</h1>
        <div className="flex flex-wrap justify-center gap-2">
          {blogData.map((blog, index) => (
            <div key={index} className="flex-shrink-0 w-full sm:w-[47%]">
              <BlogCard
                title={blog.title}
                description={blog.description}
                date={blog.date}
                link={blog.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
