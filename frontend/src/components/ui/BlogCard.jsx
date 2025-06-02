// components/BlogCard.jsx
import React from "react";

const BlogCard = ({ title, description, date, link }) => {
  return (
    <div className=" bg-gray-100 h-full flex flex-col justify-between rounded-xl shadow-md p-4">
      <img src="" alt="" className="w-full h-60 mb-10" />
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{date}</p>
        <p className="text-gray-600 mt-2 text-sm">{description}</p>
      </div>
      <a href={link} className="text-blue-600 mt-4 text-sm font-medium hover:underline">
        Read More →
      </a>
    </div>
  );
};

export default BlogCard;
