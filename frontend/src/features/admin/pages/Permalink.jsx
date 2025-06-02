import React from "react";
import { FaLink } from "react-icons/fa";

const pages = [
  { name: "About", slug: "about" },
  { name: "Portfolio", slug: "portfolio" },
  { name: "Team", slug: "team" },
  { name: "Gallery", slug: "gallery" },
  { name: "Blog", slug: "blog" },
  { name: "Contact", slug: "contact" },
  { name: "Cart", slug: "cart" },
  { name: "Service", slug: "service" },
  { name: "Package", slug: "package" },
  { name: "FAQ", slug: "faq" },
  { name: "Career", slug: "career" },
  { name: "Product", slug: "sap" },
  { name: "Get A Quote", slug: "get-a-quote" },
  { name: "Checkout", slug: "checkout" },
];

const Permalink = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaLink className="text-blue-600" />
        Permalink
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page, index) => (
          <div key={index} className="space-y-1">
            <label className="font-medium">Page Name : {page.name}</label>
            <input
              type="text"
              defaultValue={page.slug}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500">
              Full Path : <span className="text-gray-700">/{page.slug}</span>
            </p>
          </div>
        ))}
      </div>
      <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Update
      </button>
    </div>
  );
};

export default Permalink;
