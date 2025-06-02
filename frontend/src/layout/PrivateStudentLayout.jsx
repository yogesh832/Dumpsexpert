import React from "react";
import { Outlet, Link } from "react-router";
import StudentSidebar from "../features/admin/components/StudentSidebar";
import Navbar from "../components/shared/Navbar"
const PrivateStudentLayout = () => {
  return (
      <div className="flex my-20  p-10 bg-gray-100 min-h-screen rounded-2xl ">
     <Navbar />
      <StudentSidebar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateStudentLayout;
