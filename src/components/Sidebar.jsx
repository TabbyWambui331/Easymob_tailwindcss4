import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { label: "Products", path: "/products" },
    { label: "Checkout", path: "/checkout" },
    { label: "Sales History", path: "/sales-history" },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed top-0 left-0 p-6 hidden md:block">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">POS System</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`py-2 px-4 rounded ${
              pathname === link.path
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
