import { useState } from "react"
import { Link } from "react-router"
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
} from "react-icons/fa"
import { FiToggleRight, FiToggleLeft } from "react-icons/fi"
import "../../../styles/custom.css"

// Icon mapping for all menu items
const iconMap = {
  Dashboard: <FaTachometerAlt size={20} />,
  "Monthly Sale Report": <FaClipboardList size={20} />,
  "Web Customization": <FaTools size={20} />,
  "Basic Information": <FaIdBadge size={20} />,
  "Menu Builder": <FaList size={20} />,
  "Social Links": <FaPeopleArrows size={20} />,
  SEO: <FaTags size={20} />,
  "SEO Test": <FaTags size={20} />,
  Permalink: <FaList size={20} />,
  "Maintenance Mode": <FaTools size={20} />,
  Announcement: <FaBlog size={20} />,
  Preloader: <FaCogs size={20} />,
  "Footer Info": <FaList size={20} />,
  "Footer Link": <FaList size={20} />,
  "General Settings": <FaCogs size={20} />,
  "Email Configuration": <FaEnvelope size={20} />,
  Scripts: <FaTools size={20} />,
  "Cookie Alert": <FaList size={20} />,
  "Custom CSS": <FaTools size={20} />,
  "Mail From Admin": <FaEnvelope size={20} />,
  "Mail To Admin": <FaEnvelope size={20} />,
  "Follow Up Admin": <FaEnvelope size={20} />,
  "Advanced Email": <FaEnvelope size={20} />,
  "Payment Settings": <FaCreditCard size={20} />,
  Currencies: <FaCreditCard size={20} />,
  "Payment Gateway": <FaCreditCard size={20} />,
  "Shipping Method": <FaBoxOpen size={20} />,
  Products: <FaBoxOpen size={20} />,
  "Product Categories": <FaTags size={20} />,
  "Product Reviews": <FaClipboardList size={20} />,
  Coupons: <FaGift size={20} />,
  "Coupon List": <FaGift size={20} />,
  Orders: <FaShoppingCart size={20} />,
  "All Orders": <FaShoppingCart size={20} />,
  "Pending Orders": <FaShoppingCart size={20} />,
  "Completed Orders": <FaShoppingCart size={20} />,
  "Rejected Orders": <FaShoppingCart size={20} />,
  "Order Reports": <FaClipboardList size={20} />,
  "All Order Report": <FaClipboardList size={20} />,
  "Product Sale Report": <FaClipboardList size={20} />,
  Customers: <FaUser size={20} />,
  Exam: <FaBook size={20} />,
  "Exam Code": <FaIdBadge size={20} />,
  Media: <FaPhotoVideo size={20} />,
  "Media List": <FaPhotoVideo size={20} />,
  Blog: <FaBlog size={20} />,
  Category: <FaTags size={20} />,
  Archive: <FaBoxOpen size={20} />,
  Posts: <FaBlog size={20} />,
  Subscribers: <FaPeopleArrows size={20} />,
  "Subscribers List": <FaPeopleArrows size={20} />,
  "Mail to Subscribers": <FaEnvelope size={20} />,
  "Sample Downloads": <FaDownload size={20} />,
  "Downloaded Samples": <FaDownload size={20} />,
  Settings: <FaCogs size={20} />,
  General: <FaList size={20} />,
  Advanced: <FaCogs size={20} />,
  Roles: <FaUser size={20} />,
  Permissions: <FaIdBadge size={20} />,
}

// Recursive SubMenu Renderer with toggle functionality
const SubMenu = ({ items, level = 0 }) => {
  const [openSubMenus, setOpenSubMenus] = useState({})

  const toggleSubMenu = (key) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <ul className={`ml-4 mt-1 space-y-1`}>
      {items.map((child, idx) => {
        const hasChildren = Array.isArray(child.children) && child.children.length > 0
        const subMenuKey = `${level}-${idx}`
        const isSubMenuOpen = openSubMenus[subMenuKey] || false

        return (
          <li key={idx}>
            <div className="flex items-center justify-between">
              {hasChildren ? (
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--color-primary)] hover:text-blue-600 transition-all text-sm cursor-pointer">
                    {iconMap[child.label] || <FaPlusCircle size={14} />}
                    {child.label}
                  </span>
                  <button
                    onClick={() => toggleSubMenu(subMenuKey)}
                    className="text-sm px-1 cursor-pointer hover:text-blue-600"
                  >
                    {isSubMenuOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                  </button>
                </div>
              ) : (
                <Link
                  to={child.to}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--color-primary)] hover:text-blue-600 transition-all text-sm cursor-pointer w-full"
                >
                  {iconMap[child.label] || <FaPlusCircle size={14} />}
                  {child.label}
                </Link>
              )}
            </div>

            {hasChildren && isSubMenuOpen && <SubMenu items={child.children} level={level + 1} />}
          </li>
        )
      })}
    </ul>
  )
}

const Sidebar = ({ title = "Sidebar Title", items = [], className = "", variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [openMenus, setOpenMenus] = useState({})

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      if (prev) setOpenMenus({})
      return !prev
    })
  }

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const baseStyles = "h-screen transition-all duration-300"
  const variants = {
    default: "bg-white text-gray-800",
    dark: "bg-gray-800 text-white",
    blue: "bg-blue-50 text-blue-900",
    outline: "border border-gray-300",
  }

  return (
    <div className="flex h-[100vh]">
      <aside
        className={`${baseStyles} ${variants[variant]} ${className} ${
          isOpen ? "w-64 p-4" : "w-16 p-2"
        } shadow-md overflow-y-auto transition-all duration-500`}
      >
        <div className="flex items-center justify-between mb-4">
          {isOpen && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={toggleSidebar}
            className={`ml-auto text-gray-600 hover:text-blue-600 cursor-pointer ${isOpen ? "open" : "closed"}`}
          >
            {isOpen ? <FiToggleLeft size={24} /> : <FiToggleRight size={24} />}
          </button>
        </div>

        <ul className="space-y-2">
          {items.map((section, index) => (
            <li key={index}>
              {isOpen && (
                <div className="font-medium text-sm uppercase text-gray-500 mb-1 flex items-center gap-2">
                  {iconMap[section.sectionTitle] || null}
                  {section.sectionTitle}
                </div>
              )}
              <ul className="pl-1 space-y-1">
                {section.links.map((linkItem, idx) => {
                  const hasChildren = Array.isArray(linkItem.children) && linkItem.children.length > 0
                  const menuKey = `${index}-${idx}`
                  const isMenuOpen = openMenus[menuKey] || false

                  return (
                    <li key={idx}>
                      <div className="flex items-center justify-between">
                        {hasChildren ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--color-primary)] hover:text-blue-600 transition-all truncate cursor-pointer">
                              {isOpen ? (
                                <>
                                  {iconMap[linkItem.label] || <FaPlusCircle size={16} />}
                                  {linkItem.label}
                                </>
                              ) : (
                                iconMap[linkItem.label] || <FaPlusCircle size={16} />
                              )}
                            </span>
                            {isOpen && (
                              <button onClick={() => toggleMenu(menuKey)} className="text-sm px-1 cursor-pointer hover:text-blue-600">
                                {isMenuOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                              </button>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={linkItem.to}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--color-primary)] hover:text-blue-600 transition-all truncate cursor-pointer w-full"
                          >
                            {isOpen ? (
                              <>
                                {iconMap[linkItem.label] || <FaPlusCircle size={16} />}
                                {linkItem.label}
                              </>
                            ) : (
                              iconMap[linkItem.label] || <FaPlusCircle size={16} />
                            )}
                          </Link>
                        )}
                      </div>

                      {hasChildren && isOpen && isMenuOpen && <SubMenu items={linkItem.children} />}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 p-4">{/* Main Content Area */}</div>
    </div>
  )
}

const sidebarItems = [
  {
    sectionTitle: "Admin Panel",
    links: [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Monthly Sale Report", to: "/admin/monthly-sale-report" },
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
            children: [{ label: "SEO Test", to: "/admin/web-customization/seo/test" }],
          },
          { label: "Permalink", to: "/admin/web-customization/permalink" },
          { label: "Maintenance Mode", to: "/admin/web-customization/maintenance" },
          { label: "Announcement", to: "/admin/web-customization/announcement" },
          { label: "Preloader", to: "/admin/web-customization/preloader" },
          { label: "Footer Info", to: "/admin/web-customization/footer-info" },
          { label: "Footer Link", to: "/admin/web-customization/footer-link" },
        ],
      },
      {
        label: "General Settings",
        to: "/admin/settings/general",
        children: [
          { label: "Email Configuration", to: "/admin/settings/email-config" },
          { label: "Scripts", to: "/admin/settings/scripts" },
          { label: "Cookie Alert", to: "/admin/settings/cookie-alert" },
          { label: "Custom CSS", to: "/admin/settings/custom-css" },
          {
            label: "Advanced Email",
            to: "/admin/settings/email-config/advanced",
            children: [
              { label: "Mail From Admin", to: "/admin/settings/email-config/from-admin" },
              { label: "Mail To Admin", to: "/admin/settings/email-config/to-admin" },
              { label: "Follow Up Admin", to: "/admin/settings/email-config/follow-up" },
            ],
          },
        ],
      },
      {
        label: "Payment Settings",
        to: "/admin/settings/payment",
        children: [
          { label: "Currencies", to: "/admin/settings/payment/currencies" },
          { label: "Payment Gateway", to: "/admin/settings/payment/gateway" },
          { label: "Shipping Method", to: "/admin/settings/payment/shipping" },
        ],
      },
      {
        label: "Products",
        to: "/admin/products",
        children: [
          { label: "Product Categories", to: "/admin/products/categories" },
          { label: "Products", to: "/admin/products/list" },
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
      {
        label: "Order Reports",
        to: "/admin/order-reports",
        children: [
          { label: "All Order Report", to: "/admin/order-reports/all" },
          { label: "Product Sale Report", to: "/admin/order-reports/sale" },
        ],
      },
      {
        label: "Customers",
        to: "/admin/customers",
      },
      {
        label: "Exam",
        to: "/admin/exam",
        children: [{ label: "Exam Code", to: "/admin/exam/code" }],
      },
      {
        label: "Media",
        to: "/admin/media",
        children: [{ label: "Media List", to: "/admin/media/list" }],
      },
      {
        label: "Blog",
        to: "/admin/blog",
        children: [
          { label: "Category", to: "/admin/blog/category" },
          { label: "Archive", to: "/admin/blog/archive" },
          { label: "Posts", to: "/admin/blog/posts" },
        ],
      },
      {
        label: "Subscribers",
        to: "/admin/subscribers",
        children: [
          { label: "Subscribers List", to: "/admin/subscribers/list" },
          { label: "Mail to Subscribers", to: "/admin/subscribers/mail" },
        ],
      },
      {
        label: "Sample Downloads",
        to: "/admin/downloads",
        children: [{ label: "Downloaded Samples", to: "/admin/downloads/samples" }],
      },
    ],
  },
];

const AdminSidebar = () => {
  return (
    <div>
      <Sidebar title="My Admin" items={sidebarItems} variant="blue" />
    </div>
  )
}

export default AdminSidebar