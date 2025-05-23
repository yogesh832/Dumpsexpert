import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

import dumplogo from "../../assets/landingassets/dumplogo.webp";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const navLinks = [
    { label: "Home" },
    { label: "About Us" },
    { label: "IT Dumps" },
    { label: "Contact" },
    { label: "Blogs" },
    { label: "Cart", icon: <FaShoppingCart size={22} /> },
    { label: "Login/Register", icon: <FaUser size={22} /> },
  ];

  return (
    <nav className="bg-white shadow-md z-50 px-6">
      <div className=" mx-auto px-12     py-5 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center cursor-pointer space-x-4">
          <img src={dumplogo} alt="DumpsXpert Logo" className="h-18  w-48" />
        </a>

        {/* Search for md+ */}
        <div className="flex gap-6 items-center">
          <div className="hidden md:flex items-center border border-gray-400 rounded-xl px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="outline-none px-4 w-72 text-lg"
            />
          </div>
          <button className="text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition text-lg">
            <FaSearch size={20} />
          </button>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-6 md:hidden">
          <FaSearch
            className="text-blue-600 text-3xl cursor-pointer"
            onClick={toggleSearch}
          />
          <button
            onClick={toggleMenu}
            className="text-blue-600 text-4xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-12 font-semibold text-xl text-black">
          {navLinks.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 hover:text-blue-700 cursor-pointer transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Small Screen Search */}
      {showSearch && (
        <div className="px-8 pb-5 bg-white md:hidden">
          <div className="flex items-center border border-gray-400 rounded-xl px-4 py-2">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none px-4 w-full text-lg"
            />
            <button className="text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition text-lg">
              <FaSearch size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out bg-white shadow-md ${
          menuOpen ? "max-h-96 py-6" : "max-h-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col items-center space-y-6 text-black font-semibold text-xl">
          {navLinks.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-4 hover:text-blue-700 cursor-pointer transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
