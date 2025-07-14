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
import { CartProvider } from "./context/CartContext";

// Layout wrapper to handle conditional Sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebarOn = ["/login"];
  const shouldShowSidebar = !hideSidebarOn.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {shouldShowSidebar && <Sidebar />}
      <main className={`flex-1 p-4 ${shouldShowSidebar ? "ml-64" : ""}`}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/sales" element={<Sales/>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
