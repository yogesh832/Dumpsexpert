import React from "react";
import { Outlet, Link } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

//rename the file to PublicLayout.jsx
const PublicLayout = () => {
  return (
    <div>
      <header className="">
             <Navbar />
      </header>

      <main className="">
        <Outlet />
      </main>

      <footer className="">
      <Footer />
      </footer>
    </div>
  );
};

export default PublicLayout;
