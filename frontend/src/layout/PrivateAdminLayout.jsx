import React from "react";
import { Outlet, Navigate } from "react-router";
import useAuthStore from "../store/index";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import Navbar from "../components/shared/Navbar";

const PrivateAdminLayout = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <div className="p-4 text-red-600">Access denied: Admins only</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Sidebar and main layout */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Fixed Sidebar */}
        <div className="w-64 h-full fixed top-16 left-0 bg-white shadow z-10 overflow-y-auto">
          <AdminSidebar />
        </div>

        {/* Scrollable Main Content */}
        <main className="ml-64 flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateAdminLayout;
