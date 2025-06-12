import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router";
import dumplogo from "../../assets/landingassets/dumplogo.webp";
import Button from "../ui/Button";
import Input from "../ui/Input";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "IT Dumps", path: "/dumps" },
    { label: "Contact", path: "/contact" },
    { label: "Blogs", path: "/blogs" },
    { label: "Cart", path: "/cart", icon: <FaShoppingCart size={22} /> },
    { label: "Login/Register", path: "/login", icon: <FaUser size={22} /> },
  ];

  return (
    <nav className="fixed top-0 mb-20 left-0 w-full bg-white shadow-md z-50 text-lg md:px-2">
      <div className="max-w-[100vw] mx-20 py-4 flex justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer space-x-4">
          <img src={dumplogo} alt="DumpsXpert Logo" className="h-12 min-w-35 w-auto" />
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search"
            className="outline-none min-w-30 px-4 h-10 w-72 text-xl rounded-xl border border-gray-300"
          />
          <Button className="text-white bg-blue-600 px-5 py-1 rounded-lg hover:bg-blue-700 transition text-xl">
            <FaSearch size={20} />
          </Button>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-4 md:hidden">
          <FaSearch
            className="text-blue-600 text-2xl cursor-pointer"
            onClick={toggleSearch}
          />
          <button
            onClick={toggleMenu}
            className="text-blue-600 text-3xl focus:outline-none"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        
      {/* Desktop Nav Links */}
<ul className="hidden md:flex flex-nowrap justify-between items-center font-medium text-black w-full overflow-hidden">
  {navLinks.map((item, index) => (
    <li key={index} className="flex-1 text-center">
      <Link
        to={item.path}
        className="flex items-center justify-center py-2 text-[clamp(0.75rem,1vw,1rem)] whitespace-nowrap hover:text-blue-700 transition"
      >
        {item.icon}
        <span className="ml-1">{item.label}</span>
      </Link>
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
  {/* Mobile Menu */}
<div
  className={`md:hidden transition-all duration-300 ease-in-out bg-white shadow-md overflow-hidden ${
    menuOpen ? "max-h-[400px] py-6" : "max-h-0"
  }`}
>
  <ul className="flex flex-col items-center space-y-5 text-black font-medium text-sm sm:text-base">
    {navLinks.map((item, index) => (
      <li key={index}>
        <Link
          to={item.path}
          onClick={() => setMenuOpen(false)} // <-- ADD THIS LINE
          className="flex items-center gap-3 hover:text-blue-700 cursor-pointer transition"
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      </li>
    ))}
  </ul>
</div>

    </nav>
  );
};

export default Navbar;
