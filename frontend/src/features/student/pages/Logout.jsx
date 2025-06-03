import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth token or user data (modify if using cookies/sessionStorage)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optionally show a message or loading state
    setTimeout(() => {
      navigate("/login"); // Redirect to login page after logout
    }, 1000);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold">Logging out...</h2>
        <p className="text-sm mt-2 text-gray-600">Please wait.</p>
      </div>
    </div>
  );
};

export default Logout;
