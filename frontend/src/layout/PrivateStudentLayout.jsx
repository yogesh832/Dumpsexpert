import React from "react";
import { Outlet } from "react-router";
import StudentSidebar from "../features/admin/components/StudentSidebar";
import Navbar from "../components/shared/Navbar";

const PrivateStudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar - Fixed Width */}
        <div className="w-64 bg-white shadow-md min-h-screen">
          <StudentSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6 mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateStudentLayout;
