import React from "react";
import {
  UserGroupIcon,
  ClipboardListIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
  InboxIcon,
  NewspaperIcon,
  AcademicCapIcon,
} from "@heroicons/react/outline";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../../../components/ui/Sidebar"; // Optional

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Stat Cards
const statCards = [
  { title: "Total Products", value: 50, icon: ClipboardListIcon, bg: "bg-blue-100", text: "text-blue-700" },
  { title: "Total Exams", value: 12, icon: AcademicCapIcon, bg: "bg-purple-100", text: "text-purple-700" },
  { title: "Customers", value: 140, icon: UserGroupIcon, bg: "bg-green-100", text: "text-green-700" },
  { title: "Blogs", value: 18, icon: NewspaperIcon, bg: "bg-yellow-100", text: "text-yellow-700" },
  { title: "Orders", value: 65, icon: ClipboardListIcon, bg: "bg-red-100", text: "text-red-700" },
  { title: "Sales (INR)", value: "₹85,000", icon: CurrencyDollarIcon, bg: "bg-indigo-100", text: "text-indigo-700" },
  { title: "Sales (USD)", value: "$1,000", icon: CurrencyDollarIcon, bg: "bg-pink-100", text: "text-pink-700" },
  { title: "Subscribers", value: 245, icon: InboxIcon, bg: "bg-teal-100", text: "text-teal-700" },
];

// Chart Data
const doughnutData = {
  labels: ["Products", "Exams", "Orders", "Subscribers"],
  datasets: [
    {
      label: "Distribution",
      data: [50, 12, 65, 245],
      backgroundColor: ["#3B82F6", "#8B5CF6", "#EF4444", "#10B981"],
      borderWidth: 1,
    },
  ],
};

const barData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Monthly Sales (INR)",
      data: [10000, 15000, 20000, 18000, 22000],
      backgroundColor: "#6366F1",
    },
  ],
};

const doughnutOptions = {
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: { position: "bottom" },
  },
};

const barOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

// Tables
const orders = [
  { date: "2025-06-01", number: "#ORD123", gateway: "Razorpay", total: "₹500", status: "Paid", payment: "Confirmed" },
  { date: "2025-06-02", number: "#ORD124", gateway: "Stripe", total: "₹300", status: "Pending", payment: "Pending" },
];

const users = [
  { date: "2025-06-01", name: "Yagyesh", email: "yagyesh@example.com", lastActive: "2025-06-04", spend: "₹500" },
  { date: "2025-06-03", name: "Ankit", email: "ankit@example.com", lastActive: "2025-06-04", spend: "₹300" },
];

const AdminDashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Optional Sidebar */}
      {/* <Sidebar /> */}

      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className={`rounded-xl p-4 shadow-md flex items-center justify-between ${card.bg}`}>
              <div>
                <h3 className={`text-sm font-semibold ${card.text}`}>{card.title}</h3>
                <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
              </div>
              <card.icon className={`w-10 h-10 ${card.text}`} />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 h-[350px]">
            <h2 className="text-lg font-semibold mb-4">Entity Distribution</h2>
            <div className="h-[250px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 h-[350px]">
            <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
            <div className="h-[250px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Latest Orders</h2>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Order #</th>
                  <th className="px-4 py-2">Gateway</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">{order.number}</td>
                    <td className="px-4 py-2">{order.gateway}</td>
                    <td className="px-4 py-2">{order.total}</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">{order.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Latest Users</h2>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Date Registered</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Last Active</th>
                  <th className="px-4 py-2">Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{user.date}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.lastActive}</td>
                    <td className="px-4 py-2">{user.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
