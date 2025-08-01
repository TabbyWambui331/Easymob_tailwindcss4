// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Sales from "./pages/Sales";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import BusinessRegister from "./pages/BusinessRegister";
import { CartProvider } from "./context/CartContext";

// Layout to conditionally render Sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/business-register"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 p-4 ${showSidebar ? "ml-64" : ""}`}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/business-register" element={<BusinessRegister />} />
            <Route path="/header" element={<Header />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;
