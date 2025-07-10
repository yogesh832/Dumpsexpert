import React from "react";
import { useNavigate } from "react-router";

const GuestDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-gray-50  text-gray-900 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
        <span className="text-indigo-600 text-4xl">📊</span> Dashboard
      </h1>

      {/* profile  */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
        <img
          src="https://via.placeholder.com/60"
          alt="profile"
          className="w-32 h-32 rounded-full border-4 border-indigo-500 mb-4"
        />
        <h3 className="font-bold text-xl mb-1">lorem epsum</h3>
        <p className="text-gray-500 mb-4">google</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/guest/edit-profile")}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/guest/change-password")}
            className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500 transition"
          >
            Change Password
          </button>
          <button
            onClick={() => navigate("/logout")}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-white p-6 mt-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          No Subscription Found
        </h2>
        <p className="text-gray-700 mb-4">
          You don't have any active subscription yet.
        </p>
        <button
          onClick={() => navigate("/dumps")}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Buy Subscription
        </button>
      </div>
    </div>
  );
};

export default GuestDashboard;
