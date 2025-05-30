import React from "react";
import { Outlet, Link } from "react-router";

const PrivateStudentLayout = () => {
  return (
    <div>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateStudentLayout;
