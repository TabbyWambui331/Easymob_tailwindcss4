import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user = "Admin" }) => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const cards = [
    { title: "Products", description: "Go to products page", path: "/products" },
    { title: "Sales", description: "View & manage sales", path: "/sales" },
    { title: "Inventory", description: "Track stock & items", path: "/inventory" },
    { title: "Reports", description: "See reports & insights", path: "/reports" },
    { title: "Checkout", description: "Manage your checkout process", path: "/checkout" },
    { title: "Register", description: "Create a new account", path: "/register" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white p-8">
      <div className="max-w-5xl mx-auto bg-blue-900/40 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-blue-700">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow">Welcome, {user}</h1>
          <button
            onClick={handleToggle}
            className={`px-6 py-2 rounded-full font-semibold shadow transition ${
              toggle ? "bg-green-400 text-black" : "bg-red-500"
            }`}
          >
            {toggle ? "ON" : "OFF"}
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-800/60 p-4 rounded-xl border border-blue-600 shadow">
            <h2 className="text-xl font-semibold mb-2 text-white">Users</h2>
            <p className="text-sm text-blue-200">Total Users: 5</p>
          </div>

          <div className="bg-blue-800/60 p-4 rounded-xl border border-blue-600 shadow">
            <h2 className="text-xl font-semibold mb-2 text-white">Reports</h2>
            <p className="text-sm text-blue-200">You have 3 new reports.</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <h2 className="text-2xl font-bold mb-4 text-white">Navigate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.path)}
              className="cursor-pointer bg-blue-800/40 hover:bg-blue-700 transition p-5 rounded-xl border border-blue-600 shadow hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-sm text-blue-200">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
