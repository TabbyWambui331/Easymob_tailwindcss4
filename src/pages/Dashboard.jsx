import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import socket from "../socket"; //  ../socket.js exists and exports socket

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: "Ksh 45,000",
    totalProducts: 0,
    totalCustomers: 53,
  });

  const [salesData, setSalesData] = useState([
    { day: "Mon", sales: 5000 },
    { day: "Tue", sales: 6500 },
    { day: "Wed", sales: 7000 },
    { day: "Thu", sales: 4000 },
    { day: "Fri", sales: 8000 },
    { day: "Sat", sales: 9000 },
    { day: "Sun", sales: 3000 },
  ]);

  const recentOrders = [
    { id: 1, item: "Milk", amount: "Ksh 300", method: "Mpesa", date: "2025-07-15" },
    { id: 2, item: "Rice", amount: "Ksh 850", method: "Cash", date: "2025-07-15" },
    { id: 3, item: "Toothpaste", amount: "Ksh 150", method: "Bank", date: "2025-07-14" },
  ];

  // ✅ Real-time socket setup inside useEffect
  useEffect(() => {
    socket.on("new-sale", (data) => {
      console.log("🛒 Real-time Sale:", data);
      // Optional: Update stats or salesData here
    });

    return () => {
      socket.off("new-sale");
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome to Easymob</h1>
        <p className="text-lg text-gray-600 mb-6">Making your work easier and organized 🚀</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-l-4 border-green-500 p-4 shadow rounded">
            <h3 className="text-sm text-gray-500">Total Sales</h3>
            <p className="text-xl font-bold text-gray-800">{stats.totalSales}</p>
          </div>
          <div className="bg-white border-l-4 border-blue-500 p-4 shadow rounded">
            <h3 className="text-sm text-gray-500">Products</h3>
            <p className="text-xl font-bold text-gray-800">{stats.totalProducts}</p>
          </div>
          <div className="bg-white border-l-4 border-purple-500 p-4 shadow rounded">
            <h3 className="text-sm text-gray-500">Customers</h3>
            <p className="text-xl font-bold text-gray-800">{stats.totalCustomers}</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded shadow p-4 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Weekly Sales Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded shadow p-4 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">Recent Orders</h2>
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2 px-3">Item</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Payment</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3">{order.item}</td>
                  <td className="py-2 px-3">{order.amount}</td>
                  <td className="py-2 px-3">{order.method}</td>
                  <td className="py-2 px-3">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Business Mode: <span className="text-green-600 font-semibold">Active</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
