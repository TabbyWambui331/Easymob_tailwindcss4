import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // your Firebase config file
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [mostSold, setMostSold] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchMostSold();
    fetchExpiring();
  }, []);

  const fetchSales = async () => {
    const salesSnapshot = await getDocs(collection(db, "sales"));
    const sales = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSalesData(sales);
  };

  const fetchMostSold = async () => {
    const productsSnapshot = await getDocs(
      query(collection(db, "products"), orderBy("soldCount", "desc"))
    );
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMostSold(products.slice(0, 5)); // top 5
  };

  const fetchExpiring = async () => {
    const now = new Date();
    const expiringSnapshot = await getDocs(
      query(collection(db, "products"), where("expiryDate", "<=", now.toISOString()))
    );
    const products = expiringSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setExpiringProducts(products);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-blue-900">
      <h2 className="text-3xl font-bold mb-6">📊 Sales Reports</h2>

      {/* Total Sales */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Total Sales</h3>
        <div className="bg-white shadow rounded p-4">
          <table className="w-full text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale.id} className="border-b">
                  <td className="p-2">{new Date(sale.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 capitalize">{sale.paymentMethod}</td>
                  <td className="p-2">Ksh {sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Most Sold Products */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-3">🔥 Most Sold Products</h3>
        <div className="bg-white shadow rounded p-4">
          <ul className="list-disc pl-5">
            {mostSold.map((product) => (
              <li key={product.id}>
                {product.name} - Sold {product.soldCount || 0} times
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Expiring Products */}
      <div>
        <h3 className="text-xl font-semibold mb-3">⏳ Expiring Soon</h3>
        <div className="bg-white shadow rounded p-4">
          <ul className="list-disc pl-5 text-red-600">
            {expiringProducts.map((product) => (
              <li key={product.id}>
                {product.name} - Expires on{" "}
                {new Date(product.expiryDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
