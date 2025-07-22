// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Sales from "./pages/Sales";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import BusinessRegister from "./pages/BusinessRegister";

// Layout wrapper to conditionally show Sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebarOn = ["/login", "/business-register"];
  const shouldShowSidebar = !hideSidebarOn.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {shouldShowSidebar && <Sidebar />}
      <main className={`flex-1 p-4 ${shouldShowSidebar ? "ml-64" : ""}`}>
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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/business-register" element={<BusinessRegister />} />
            <Route path="/header" element={<Header />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;
