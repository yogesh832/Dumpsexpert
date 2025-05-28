import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

import dumplogo from "../../assets/landingassets/dumplogo.webp";
import Button from "../ui/Button";
import Input from "../ui/Input";

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
    <nav className="bg-white shadow-md z-50 px-4 md:px-6">
  <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
    {/* Logo */}
    <a href="/" className="flex items-center cursor-pointer space-x-4">
      <img src={dumplogo} alt="DumpsXpert Logo" className="h-12 w-auto" />
    </a>

    {/* Desktop Search */}
    <div className="hidden md:flex items-center gap-3">
      <Input
        type="text"
        placeholder="Search"
        className="outline-none px-4 py-2 w-72 text-lg rounded-xl border border-gray-300"
      />
      <Button className="text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition text-lg">
        <FaSearch size={20} />
      </Button>
    </div>

    {/* Mobile Icons */}
    <div className="flex items-center gap-4 md:hidden">
      <FaSearch
        className="text-blue-600 text-2xl cursor-pointer"
        onClick={toggleSearch}
      />
      <Button
        onClick={toggleMenu}
        className="text-blue-600 text-3xl focus:outline-none"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </Button>
    </div>

    {/* Desktop Nav Links */}
    <ul className="hidden md:flex space-x-8 font-semibold text-base text-black">
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

  {/* Mobile Search Input */}
  {showSearch && (
    <div className="px-4 pb-4 md:hidden">
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 gap-2">
        <Input
          type="text"
          placeholder="Search..."
          className="outline-none flex-grow text-lg"
        />
        <Button className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition text-lg">
          <FaSearch size={20} />
        </Button>
      </div>
    </div>
  )}

  {/* Mobile Menu */}
  <div
    className={`md:hidden transition-all duration-300 ease-in-out bg-white shadow-md overflow-hidden ${
      menuOpen ? "max-h-[400px] py-6" : "max-h-0"
    }`}
  >
<ul className="flex flex-col items-center space-y-5 text-black font-medium text-sm sm:text-base">
      {navLinks.map((item, index) => (
        <li
          key={index}
          className="flex items-center gap-3 hover:text-blue-700 cursor-pointer transition"
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
