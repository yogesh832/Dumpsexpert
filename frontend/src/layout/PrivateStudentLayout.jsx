import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import StudentSidebar from "../features/student/components/StudentSidebar";

const PrivateStudentLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Fixed Sidebar */}
        <div className="w-64 fixed top-16 left-0 h-full bg-white shadow-md overflow-y-auto z-10">
          <StudentSidebar />
        </div>

        {/* Scrollable Main Content Area */}
        <main className="ml-64 flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateStudentLayout;
