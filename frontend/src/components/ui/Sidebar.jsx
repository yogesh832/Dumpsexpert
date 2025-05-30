import { useState } from "react";
import { Link } from "react-router"; // Use react-router-dom
import {
  FaChevronDown,
  FaChevronRight,
  FaPlusCircle,
  FaCogs,
  FaList,
  FaTachometerAlt,
  FaUser,
  FaBook,
  FaIdBadge,
} from "react-icons/fa";
import { FiToggleRight, FiToggleLeft } from "react-icons/fi";
import "../../styles/custom.css";

const Sidebar = ({
  title = "Sidebar Title",
  items = [],
  className = "",
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      if (prev) setOpenMenus({});
      return !prev;
    });
  };

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const baseStyles = "h-screen transition-all duration-300";
  const variants = {
    default: "bg-white text-gray-800",
    dark: "bg-gray-800 text-white",
    blue: "bg-blue-50 text-blue-900",
    outline: "border border-gray-300",
  };

  // Icon mapping for labels
  const iconMap = {
    Dashboard: <FaTachometerAlt />,
    Users: <FaUser />,
    Settings: <FaCogs />,
    Courses: <FaBook />,
    Profile: <FaIdBadge />,
    "Add Something": <FaPlusCircle />,
    General: <FaList />,
    Advance: <FaCogs />,
  };

  return (
    <div className="flex">
      <aside
        className={`${baseStyles} ${variants[variant]} ${className} ${
          isOpen ? "w-64 p-4 sidebar-open" : "w-16 p-2 sidebar-close"
        } shadow-md overflow-y-auto transition-all duration-500`}
      >
        <div className="flex items-center justify-between mb-4">
          {isOpen && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={toggleSidebar}
            className={`ml-auto text-gray-600 hover:text-black toggle-animation cursor-pointer ${
              isOpen ? "open" : "closed"
            }`}
          >
            {isOpen ? <FiToggleLeft size={24} /> : <FiToggleRight size={24} />}
          </button>
        </div>

        <ul className="space-y-2">
          {items.map((section, index) => (
            <li key={index}>
              {isOpen && (
                <div className="font-medium text-sm uppercase text-gray-500 mb-1 flex items-center gap-1">
                  {iconMap[section.sectionTitle] || null}
                  {section.sectionTitle}
                </div>
              )}
              <ul className="pl-1 space-y-1">
                {section.links.map((linkItem, idx) => {
                  const hasChildren =
                    Array.isArray(linkItem.children) &&
                    linkItem.children.length > 0;
                  const isMenuOpen = openMenus[`${index}-${idx}`];

                  return (
                    <li key={idx}>
                      <div className="flex items-center justify-between">
                        <Link
                          to={linkItem.to}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--color-primary)] hover:text-white transition-all truncate"
                        >
                          {isOpen ? (
                            <>
                              {iconMap[linkItem.label] || null}
                              {linkItem.label}
                            </>
                          ) : (
                            iconMap[linkItem.label] || linkItem.label.charAt(0)
                          )}
                        </Link>
                        {hasChildren && isOpen && (
                          <button
                            onClick={() => toggleMenu(`${index}-${idx}`)}
                            className="text-sm px-1"
                          >
                            {isMenuOpen ? (
                              <FaChevronDown size={12} />
                            ) : (
                              <FaChevronRight size={12} />
                            )}
                          </button>
                        )}
                      </div>

                      {hasChildren && isOpen && isMenuOpen && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {linkItem.children.map((child, childIdx) => (
                            <li key={childIdx}>
                              <Link
                                to={child.to}
                                className="block px-2 py-1 rounded hover:bg-[var(--color-primary)] hover:text-white transition-all text-sm"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 p-4">{/* your main content */}</div>
    </div>
  );
};

export default Sidebar;

// eg for defining the lists of items 
// const sidebarItems = [
//   {
//     sectionTitle: "Admin Panel",
//     links: [
//       {
//         label: "Dashboard",
//         to: "/dashboard",
//       },
//       {
//         label: "Users",
//         to: "/users",
//         children: [
//           { label: "Add User", to: "/users/add" },
//           { label: "Manage Users", to: "/users/manage" },
//           { label: "User Reports", to: "/users/reports" },
//         ],
//       },
//     ],
//   },
//   {
//     sectionTitle: "Settings",
//     links: [
//       { label: "General", to: "/settings" },
//       {
//         label: "Advanced",
//         to: "/settings/advanced",
//         children: [
//           { label: "Roles", to: "/settings/roles" },
//           { label: "Permissions", to: "/settings/permissions" },
//         ],
//       },
//     ],
//   },
// ];

// calling them 
// <Sidebar title="My Admin" items={sidebarItems} variant="blue" />;

