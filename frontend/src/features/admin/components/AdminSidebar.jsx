import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router"; // react-router-dom for Link and useLocation
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
  FaTags,
  FaClipboardList,
  FaShoppingCart,
  FaCreditCard,
  FaBoxOpen,
  FaGift,
  FaPeopleArrows,
  FaPhotoVideo,
  FaBlog,
  FaEnvelope,
  FaDownload,
  FaTools,
} from "react-icons/fa";
import { FiToggleRight, FiToggleLeft } from "react-icons/fi";
import "../../../styles/custom.css";

// Icon mapping for all menu items
const iconMap = {
  Dashboard: <FaTachometerAlt size={20} />,
  // "Monthly Sale Report": <FaClipboardList size={20} />,
  "Web Customization": <FaTools size={20} />,
  "Basic Information": <FaIdBadge size={20} />,
  "Menu Builder": <FaList size={20} />,
  "Social Links": <FaPeopleArrows size={20} />,
  SEO: <FaTags size={20} />,
  "SEO Meta Info": <FaTags size={20} />,
  "SEO Site Map": <FaTags size={20} />,
  Permalink: <FaList size={20} />,
  "Maintenance Mode": <FaTools size={20} />,
  Announcement: <FaBlog size={20} />,
  Preloader: <FaCogs size={20} />,
  // "Footer Info": <FaList size={20} />,
  // "Footer Link": <FaList size={20} />,
  // "General Settings": <FaCogs size={20} />,
  // "Email Configuration": <FaEnvelope size={20} />,
  Scripts: <FaTools size={20} />,
  // "Cookie Alert": <FaList size={20} />,
  // "Custom CSS": <FaTools size={20} />,
  "Mail From Admin": <FaEnvelope size={20} />,
  "Mail To Admin": <FaEnvelope size={20} />,
  // "Follow Up Admin": <FaEnvelope size={20} />,
  // "Advanced Email": <FaEnvelope size={20} />,
  // "Payment Settings": <FaCreditCard size={20} />,
  Currencies: <FaCreditCard size={20} />,
  "Payment Gateway": <FaCreditCard size={20} />,
  "Shipping Method": <FaBoxOpen size={20} />,
  Products: <FaBoxOpen size={20} />,
  "Product Categories": <FaTags size={20} />,
  "Product List": <FaBoxOpen size={20} />,
  "Product Reviews": <FaClipboardList size={20} />,
  Coupons: <FaGift size={20} />,
  "Coupon List": <FaGift size={20} />,
  Orders: <FaShoppingCart size={20} />,
  "All Orders": <FaShoppingCart size={20} />,
  "Pending Orders": <FaShoppingCart size={20} />,
  "Completed Orders": <FaShoppingCart size={20} />,
  "Rejected Orders": <FaShoppingCart size={20} />,
  "Order Reports": <FaClipboardList size={20} />,
  // "All Order Report": <FaClipboardList size={20} />,
  "Product Sale Report": <FaClipboardList size={20} />,
  Customers: <FaUser size={20} />,
  Exam: <FaBook size={20} />,
  "Online Exam": <FaIdBadge size={20} />,
  Media: <FaPhotoVideo size={20} />,
  "Media List": <FaPhotoVideo size={20} />,
  Blog: <FaBlog size={20} />,
  Category: <FaTags size={20} />,
  Archive: <FaBoxOpen size={20} />,
  Posts: <FaBlog size={20} />,
  Subscribers: <FaPeopleArrows size={20} />,
  "Subscribers List": <FaPeopleArrows size={20} />,
  "Mail to Subscribers": <FaEnvelope size={20} />,
  Downloads: <FaDownload size={20} />,
  "Downloaded Samples": <FaDownload size={20} />,
  Settings: <FaCogs size={20} />,
};

// Recursive SubMenu Renderer with open state and active highlight
const SubMenu = ({ items, level = 0, openMenus, toggleMenu, activePath }) => {
  return (
    <ul className={`ml-4 mt-1 space-y-1`}>
      {items.map((child, idx) => {
        const hasChildren =
          Array.isArray(child.children) && child.children.length > 0;
        const subMenuKey = `${level}-${idx}`;
        const isSubMenuOpen = openMenus[subMenuKey] || false;
        const isActive = activePath === child.to;

        return (
          <li key={idx}>
            <div className="flex items-center justify-between">
              {hasChildren ? (
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer truncate
                      ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold"
                          : "hover:bg-[var(--color-primary)] hover:text-blue-600 text-sm"
                      }`}
                    onClick={() => toggleMenu(subMenuKey)}
                    title={child.label}
                  >
                    {iconMap[child.label] || <FaPlusCircle size={14} />}
                    {child.label}
                  </span>
                  <button
                    onClick={() => toggleMenu(subMenuKey)}
                    className={`text-sm px-1 cursor-pointer hover:text-blue-600`}
                    aria-label={
                      isSubMenuOpen ? "Collapse submenu" : "Expand submenu"
                    }
                  >
                    {isSubMenuOpen ? (
                      <FaChevronDown size={10} />
                    ) : (
                      <FaChevronRight size={10} />
                    )}
                  </button>
                </div>
              ) : (
                <Link
                  to={child.to}
                  className={`flex items-center gap-2 px-2 py-1 rounded truncate
                    ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold"
                        : "hover:bg-[var(--color-primary)] hover:text-blue-600 text-sm"
                    }`}
                  title={child.label}
                >
                  {iconMap[child.label] || <FaPlusCircle size={14} />}
                  {child.label}
                </Link>
              )}
            </div>

            {hasChildren && isSubMenuOpen && (
              <SubMenu
                items={child.children}
                level={level + 1}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                activePath={activePath}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

const Sidebar = ({
  title = "Sidebar Title",
  items = [],
  className = "",
  variant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      if (prev) setOpenMenus({}); // Close all menus if sidebar is collapsed
      return !prev;
    });
  };

  // Toggle open/close menu or submenu
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Check if current path matches or starts with the given to link
  // Helps keep parents open if child route is active
  const isPathActive = (path) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // Auto open menus that contain active path on first render or when location changes
  // This keeps the parent menus open when a child route is active
useEffect(() => {
    const openMenuKeys = {};

    items.forEach((section, sectionIdx) => {
      section.links.forEach((linkItem, linkIdx) => {
        const menuKey = `${sectionIdx}-${linkIdx}`;

        // If this link or any of its children matches active path, open it
        const checkOpen = (item) => {
          if (isPathActive(item.to)) {
            return true;
          }
          if (item.children) {
            return item.children.some(checkOpen);
          }
          return false;
        };

        if (checkOpen(linkItem)) {
          openMenuKeys[menuKey] = true;
        }
      });
    });

    setOpenMenus(openMenuKeys);
  }, [location.pathname, items]);

  const baseStyles = "h-screen transition-all duration-300 select-none";
  const variants = {
    default: "bg-white text-gray-800",
    dark: "bg-gray-800 text-white",
    blue: "bg-blue-50 text-blue-900",
    outline: "border border-gray-300",
  };

  return (
    <div className="flex h-[100vh]">
      <aside
        className={`${baseStyles} ${variants[variant]} ${className} ${
          isOpen ? "w-64 p-4" : "w-16 p-2"
        } shadow-md overflow-y-auto transition-all duration-500`}
      >
        <div className="flex items-center justify-between mb-4">
          {isOpen && (
            <h2 className="text-xl font-semibold select-text ">{title}</h2>
          )}
          <button
            onClick={toggleSidebar}
            className={`ml-auto text-gray-600 hover:text-blue-600 cursor-pointer`}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <FiToggleLeft size={24} /> : <FiToggleRight size={24} />}
          </button>
        </div>

        <ul className="space-y-4">
          {items.map((section, index) => (
            <li key={index}>
              {isOpen && (
                <div
                  className="font-medium text-xs uppercase text-gray-500 mb-2 flex items-center gap-2 select-text"
                  title={section.sectionTitle}
                >
                  {iconMap[section.sectionTitle] || null}
                  {section.sectionTitle}
                </div>
              )}
              <ul className="pl-1 space-y-1">
                {section.links.map((linkItem, idx) => {
                  const hasChildren =
                    Array.isArray(linkItem.children) &&
                    linkItem.children.length > 0;
                  const menuKey = `${index}-${idx}`;
                  const isMenuOpen = openMenus[menuKey] || false;
                  const isActive = isPathActive(linkItem.to);

                  return (
                    <li key={idx}>
                      <div className="flex items-center justify-between">
                        {hasChildren ? (
                          <div className="flex items-center justify-between w-full">
                            <span
                              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer truncate
                              ${
                                isActive
                                  ? "bg-blue-600 text-white font-semibold"
                                  : "hover:bg-[var(--color-primary)] hover:text-blue-600 text-sm"
                              }`}
                              onClick={() => toggleMenu(menuKey)}
                              title={linkItem.label}
                            >
                              {isOpen
                                ? iconMap[linkItem.label] || (
                                    <FaPlusCircle size={16} />
                                  )
                                : iconMap[linkItem.label] || (
                                    <FaPlusCircle size={16} />
                                  )}
                              {isOpen && linkItem.label}
                            </span>
                            {isOpen && (
                              <button
                                onClick={() => toggleMenu(menuKey)}
                                className="text-sm px-1 cursor-pointer hover:text-blue-600"
                                aria-label={
                                  isMenuOpen
                                    ? "Collapse submenu"
                                    : "Expand submenu"
                                }
                              >
                                {isMenuOpen ? (
                                  <FaChevronDown size={12} />
                                ) : (
                                  <FaChevronRight size={12} />
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={linkItem.to}
                            className={`flex items-center gap-2 px-2 py-1 rounded truncate w-full
                              ${
                                isActive
                                  ? "bg-blue-600 text-white font-semibold"
                                  : "hover:bg-[var(--color-primary)] hover:text-blue-600 text-sm"
                              }`}
                            title={linkItem.label}
                          >
                            {isOpen
                              ? iconMap[linkItem.label] || (
                                  <FaPlusCircle size={16} />
                                )
                              : iconMap[linkItem.label] || (
                                  <FaPlusCircle size={16} />
                                )}
                            {isOpen && linkItem.label}
                          </Link>
                        )}
                      </div>

                      {hasChildren && isOpen && isMenuOpen && (
                        <SubMenu
                          items={linkItem.children}
                          level={1}
                          openMenus={openMenus}
                          toggleMenu={toggleMenu}
                          activePath={location.pathname}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

const sidebarItems = [
  {
    sectionTitle: "Admin Panel",
    links: [
      { label: "Dashboard", to: "/admin/dashboard" },
      {
        label: "Web Customization",
        to: "/admin/web-customization",
        children: [
          { label: "Basic Information", to: "/admin/web-customization/basic-info" },
          { label: "Menu Builder", to: "/admin/web-customization/menu-builder" },
          { label: "Social Links", to: "/admin/web-customization/social-links" },
          {
            label: "SEO",
            to: "/admin/web-customization/seo",
            children: [
              { label: "SEO Meta Info", to: "/admin/web-customization/seo/meta-info" },
              { label: "SEO Site Map", to: "/admin/web-customization/seo/site-map" },
            ],
          },
          { label: "Permalink", to: "/admin/web-customization/permalink" },
          { label: "Maintenance Mode", to: "/admin/web-customization/maintenance" },
          { label: "Announcement", to: "/admin/web-customization/announcement" },
          { label: "Preloader", to: "/admin/web-customization/preloader" },
        ],
      },
      // {
      //   label: "Settings",
      //   to: "/admin/settings",
      //   children: [
      //     // { label: "General Settings", to: "/admin/settings/general" },
      //     {
      //       label: "Email Configuration",
      //       to: "/admin/settings/email-config",
      //       children: [
      //         { label: "Mail From Admin", to: "/admin/settings/email-config/from-admin" },
      //         { label: "Mail To Admin", to: "/admin/settings/email-config/to-admin" },
      //       ],
      //     },
      //     { label: "Scripts", to: "/admin/settings/scripts" },
      //   ],
      // },
  
      {
        label: "Products",
        to: "/admin/products",
        children: [
          { label: "Product Categories", to: "/admin/products/categories" },
          { label: "Product List", to: "/admin/products/list" },
          { label: "Product Reviews", to: "/admin/products/reviews" },
        ],
      },
      {
        label: "Coupons",
        to: "/admin/coupons",
        children: [{ label: "Coupon List", to: "/admin/coupons/list" }],
      },
      {
        label: "Orders",
        to: "/admin/orders",
        children: [
          { label: "All Orders", to: "/admin/orders/all" },
          { label: "Pending Orders", to: "/admin/orders/pending" },
          { label: "Completed Orders", to: "/admin/orders/completed" },
          { label: "Rejected Orders", to: "/admin/orders/rejected" },
        ],
      },
      // {
      //   label: "Order Reports",
      //   to: "/admin/order-reports",
      //   children: [
      //     { label: "All Order Report", to: "/admin/order-reports/all" },
      //     { label: "Product Sale Report", to: "/admin/order-reports/sale" },
      //   ],
      // },
      // { label: "Customers", to: "/admin/customers" },
      {
        label: "Exam",
        to: "/admin/exam",
        children: [{ label: "Exam Code", to: "/admin/exam/code" }],
      },
    
      {
        label: "Blog",
        to: "/admin/blog",
        children: [
          { label: "Category", to: "/admin/blog/category" },
          { label: "Posts", to: "/admin/blog/posts" },
        ],
      },
      {
  label: "Manage General FAQs",
  to: "/admin/general-faqs",
},

    ],
  },
];


const AdminSidebar = () => {
  return (
    <div className="pb-20">
      <Sidebar title="My Admin" items={sidebarItems} variant="blue" />
    </div>
  );
};

export default AdminSidebar;
