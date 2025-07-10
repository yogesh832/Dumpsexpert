import React from "react";
import { Outlet, Link } from "react-router";
import Navbar from "../components/shared/Navbar";
import GuestSidebar from "../features/guest/components/GuestSidebar";

const PrivateGuestLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Fixed Sidebar */}
        <div className="w-70 fixed  left-0 h-full bg-white shadow-md overflow-y-auto z-10">
          <GuestSidebar />
        </div>

        {/* Scrollable Main Content Area */}
        <main className="ml-72 flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateGuestLayout;
