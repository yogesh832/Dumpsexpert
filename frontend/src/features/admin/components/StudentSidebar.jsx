import React from "react";
import {
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
  FaFileAlt,
} from "react-icons/fa";
import { NavLink } from "react-router"; // ✅ fix import from react-router-dom

const menuItems = [
  {
    name: "My Account",
    to: "/student/account",
    icon: <FaUser />,
  },
  {
    name: "My Orders",
    to: "/student/orders",
    icon: <FaShoppingCart />,
  },
  {
    name: "Exam Dashboard",
    to: "/student/exam-dashboard",
    icon: <FaFileAlt />,
  },
  {
    name: "Logout",
    to: "/logout",
    icon: <FaSignOutAlt />,
  },
];

const StudentSidebar = () => {
  return (
    <div className="w-64 min-h-screen text-gray-900 border-r-2 border-gray-200 p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center mb-6">🎓 Student Panel</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <NavLink
            to={item.to}
            key={index}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-800 hover:text-blue-400"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-base font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default StudentSidebar;
