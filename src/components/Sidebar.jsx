import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 transition ${
      isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
    }`;

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow">
        <h1 className="text-xl font-bold text-blue-700">Easymob</h1>
        <button
          onClick={() => setOpen(!open)}
          className="text-blue-700 focus:outline-none text-2xl"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white w-64 h-screen fixed top-0 left-0 border-r shadow z-40 transition-transform transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-700">Easymob POS</h1>
          <p className="text-sm text-gray-500 mt-1">Business Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink to="/" className={linkClasses} onClick={() => setOpen(false)}>
            <FaTachometerAlt />
            Dashboard
          </NavLink>
          <NavLink to="/products" className={linkClasses} onClick={() => setOpen(false)}>
            <FaBoxOpen />
            Products
          </NavLink>
          <NavLink to="/checkout" className={linkClasses} onClick={() => setOpen(false)}>
            <FaShoppingCart />
            Checkout
          </NavLink>
          <NavLink to="/sales" className={linkClasses} onClick={() => setOpen(false)}>
            <FaChartLine />
            Sales
          </NavLink>
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 w-full rounded transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
