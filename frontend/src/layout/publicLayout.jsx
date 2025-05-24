import React from "react";
import { Outlet, Link } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";


const PublicLayout = () => {
  return (
    <div>
      <header className="bg-blue-100 p-4">
             <Navbar />
      </header>

      <main className="p-4 bg-[#f9f9f9]">
        <Outlet />
      </main>

      <footer className="bg-gray-200 p-4 text-center">
      <Footer />
      </footer>
    </div>
  );
};

export default PublicLayout;
