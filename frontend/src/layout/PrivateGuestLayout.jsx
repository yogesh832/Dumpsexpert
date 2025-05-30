import React from "react";
import { Outlet, Link } from "react-router";

const PrivateGuestLayout = () => {
  return (
    <div>

      <main className="p-4">
        <Outlet />
      </main>

     
    </div>
  );
};

export default PrivateGuestLayout;
