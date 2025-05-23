import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="https://www.dumpsxpert.com/assets/images/logo.png"
          alt="DumpsXpert Logo"
          className="h-10"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-700 items-center">
        <li><a href="#">Home</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">IT Dumps</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Blogs</a></li>
        <li><a href="#">Cart</a></li>
        <li><a href="#">Login/Register</a></li>
      </ul>

      {/* Hamburger Icon */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-2xl text-gray-700 focus:outline-none"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center gap-4 py-4 z-50 md:hidden">
          <li><a href="#" onClick={toggleMenu}>Home</a></li>
          <li><a href="#" onClick={toggleMenu}>About Us</a></li>
          <li><a href="#" onClick={toggleMenu}>IT Dumps</a></li>
          <li><a href="#" onClick={toggleMenu}>Contact Us</a></li>
          <li><a href="#" onClick={toggleMenu}>Blogs</a></li>
          <li><a href="#" onClick={toggleMenu}>Cart</a></li>
          <li><a href="#" onClick={toggleMenu}>Login/Register</a></li>
        </ul>
      )}
    </nav>
  );
}
