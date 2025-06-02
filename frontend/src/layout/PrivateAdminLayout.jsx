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
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <div className="flex flex-1">
        <AdminSidebar className="w-64 flex-shrink-0" />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateAdminLayout;