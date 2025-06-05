import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Dummy analytics data
  const barData = {
    labels: ["Attempt 1", "Attempt 2", "Attempt 3"],
    datasets: [
      {
        label: "Score %",
        data: [83, 92, 89],
        backgroundColor: "#4F46E5",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [4, 2],
        backgroundColor: ["#22C55E", "#EAB308"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50  text-gray-900 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
        <span className="text-indigo-600 text-4xl">📊</span> Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Result Chart */}
        <div className="bg-white h-100 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4 text-indigo-700">
            Result Analytics
          </h2>
          <Bar
            data={barData}
            height={10}
            options={{ maintainAspectRatio: false }}
          />
        </div>

        {/* Course Completion */}
        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-indigo-700">
            Course Completion
          </h2>
          <Doughnut data={doughnutData} options={{ cutout: "70%" }} />
        </div>

        {/* Profile */}
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
              onClick={() => navigate("/student/edit-profile")}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/student/change-password")}
              className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500 transition"
            >
              Change Password
            </button>
            <button
              onClick={() => navigate("/student/logout")}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Exams */}
        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-indigo-600 text-2xl">📅</span> Exams
          </h2>
          <p className="text-gray-500 mb-4 text-sm">2 upcoming exams</p>
          <button
            onClick={() => navigate("/student/courses-exam")}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View All Exams
          </button>
        </div>

        {/* My Courses */}
        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-indigo-600 text-2xl">📚</span> Courses
          </h2>
          <p className="text-gray-500 mb-4 text-sm">4 active courses</p>
          <button
            onClick={() => navigate("/student/courses-pdf")}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View All Courses
          </button>
        </div>

        {/* Result History */}
        <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-indigo-600 text-2xl">📈</span> Results
          </h2>
          <p className="text-gray-500 mb-4 text-sm">3 attempts recorded</p>
          <button
            onClick={() => navigate("/student/results")}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View All Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
