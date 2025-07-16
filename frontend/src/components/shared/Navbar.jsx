import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { LuChevronDown } from "react-icons/lu";
import { Link } from "react-router";
import dumplogo from "../../assets/landingassets/dumplogo.webp";
import Button from "../ui/Button";
import Input from "../ui/Input";
import useCartStore from "../../store/useCartStore";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const cartCount = useCartStore((state) => state.getCartCount());

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/product-categories"
        );
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "IT Dumps", path: "/dumps", hasDropdown: true },
    { label: "Contact", path: "/contact" },
    // { label: "Blogs", path: "/blogs" },
    {
      label: "Cart",
      path: "/cart",
      icon: (
        <div className="relative">
          <FaShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      ),
    },
    { type: "search" },
    {
      label: "Login/Register",
      path: "/login",
      icon: <FaUser size={22} />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 text-lg md:px-2">
      <div className="max-w-[100vw] mx-4 md:mx-20 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer space-x-4">
          <img
            src={dumplogo}
            alt="DumpsXpert Logo"
            className="h-16 min-w-35 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex justify-between items-center font-medium text-black w-full ml-10">
          {navLinks.map((item, index) => {
            if (item.type === "search") {
              return (
                <li key={index} className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="outline-none min-w-30 px-4 h-10 w-72 text-xl rounded-xl border border-gray-300"
                  />
                  <Button className="ml-2 text-white bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition text-xl">
                    <FaSearch size={20} />
                  </Button>
                </li>
              );
            }

            if (item.hasDropdown) {
              return (
                <li
                  key={index}
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="flex items-center gap-1 px-4 py-2 cursor-pointer hover:text-blue-700 transition">
                    <Link to={item.path} className="flex items-center gap-1">
                      {item.icon}
                      <span>{item.label}</span>
                      <LuChevronDown className="mt-1 text-sm" />
                    </Link>
                  </div>

                  {showDropdown && categories.length > 0 && (
                    <ul className="absolute left-0 top-full mt-0.5 w-48 bg-white shadow-lg rounded-md z-50">
                      {categories.map((cat) => (
                        <Link
                          to={`/courses/${cat.name.toLowerCase()}`}
                          key={cat._id}
                          className="block px-4 py-2 text-sm text-black hover:bg-blue-100 cursor-pointer capitalize"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-2 whitespace-nowrap hover:text-blue-700 transition"
                >
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

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
      </div>

      {/* Mobile Search */}
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
          menuOpen ? "max-h-[500px] py-4" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col items-start space-y-4 px-4 text-black font-medium text-sm sm:text-base">
          {navLinks.map((item, index) => {
            if (item.type === "search") {
              return (
                <li key={index} className="w-full">
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
                </li>
              );
            }

            return (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 hover:text-blue-700 cursor-pointer transition"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>

                {/* Mobile Dropdown */}
                {item.hasDropdown && categories.length > 0 && (
                  <ul className="ml-6 mt-1">
                    {categories.map((cat) => (
                      <Link
                        to={`/courses/${cat.name.toLowerCase()}`}
                        key={cat._id}
                        onClick={() => setMenuOpen(false)}
                        className="block text-sm text-black hover:text-blue-500 py-1 capitalize"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
