import React, { useContext } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Header = () => {
  const { cartItems } = useContext(CartContext);

  const totalItems = cartItems.length;

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-blue-800 text-white shadow-md">
      <Link to="/" className="text-2xl font-bold">
        EasyMob POS
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/reports" className="hover:underline">
          Reports
        </Link>
        <Link to="/checkout" className="relative">
          <FaShoppingCart className="text-2xl" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-xs rounded-full px-2">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
