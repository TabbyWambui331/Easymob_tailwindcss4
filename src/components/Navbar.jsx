import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      <div className="flex gap-4 font-semibold">
        {isLoggedIn ? (
          <>
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/checkout" className="hover:underline">Checkout</Link>
            <Link to="/sales-history" className="hover:underline">Sales History</Link>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
      </div>

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
