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
    <div className="flex">
      <Navbar />
      <AdminSidebar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateAdminLayout;
