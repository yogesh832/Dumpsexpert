import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

const BlogCard = ({ title, date = "2025-01-27 16:14:21", buttonText = "Read More", onClick }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-sm w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1746483966259-0baccf56ec97?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Blog cover"
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{date}</p>
        <button
          onClick={onClick}
          className="flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold transition duration-200 cursor-pointer"
        >
          {buttonText}
          <MdArrowRightAlt size={20} />
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
