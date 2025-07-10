import React from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
  FaFileAlt,
} from "react-icons/fa";
import { NavLink } from "react-router"; 

const menuItems = [
  { name: "Dashboard", to: "/guest/dashboard", icon: <FaUser /> },
  { name: "Edit Profile", to: "/guest/edit-profile", icon: <FaUser /> },
  { name: "Change Password", to: "/guest/change-password", icon: <FaUser /> },
  { name: "Logout", to: "/logout", icon: <FaSignOutAlt /> },
];

const GuestSidebar = () => (
  <div className="w-64 mt-4 min-h-screen bg-white  p-2">
    <h2 className="text-2xl font-bold text-center mb-6">🎓 Student Panel</h2>
    <nav className="flex flex-col gap-2">
      {menuItems.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 transition ${
              isActive ? "bg-blue-600 text-white" : "text-gray-700"
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  </div>
);

export default GuestSidebar;