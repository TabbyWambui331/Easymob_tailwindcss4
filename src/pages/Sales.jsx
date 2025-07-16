import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";


const Sales = () => {
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  const [recentSales, setRecentSales] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    const storedSales = JSON.parse(localStorage.getItem("sales")) || [];

    // Sort and reverse
    const sorted = storedSales.sort((a, b) => new Date(b.date) - new Date(a.date));
    setSales(sorted);

    // Filter sales in last 24 hours
    const last24h = sorted.filter(sale =>
      dayjs().diff(dayjs(sale.date), "hour") <= 24
    );
    setRecentSales(last24h);

    // Count products
    const productCounts = {};
    storedSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productCounts[item.name]) {
          productCounts[item.name] = 0;
        }
        productCounts[item.name] += item.qty;
      });
    });

    const top = Object.entries(productCounts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    setTopProducts(top);

    // Payment breakdown
    const paymentData = {};
    storedSales.forEach(sale => {
      const method = sale.paymentMethod || "Unknown";
      if (!paymentData[method]) paymentData[method] = 0;
      paymentData[method] += sale.total;
    });
    setPaymentStats(paymentData);

    // Products near expiry (within 7 days)
    const allItems = storedSales.flatMap(s => s.items);
    const expiring = allItems.filter(item =>
      item.expiryDate && dayjs(item.expiryDate).diff(dayjs(), "day") <= 7
    );
    setExpiringProducts(expiring);

  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Sales History & Reports</h1>

      {/* 24hr Sales */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">Sales in the Last 24 Hours</h2>
        {recentSales.length === 0 ? (
          <p className="text-gray-500">No sales in the last 24 hours.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-700">
            {recentSales.map(sale => (
              <li key={sale.id} className="border-b pb-2">
                {dayjs(sale.date).format("DD MMM, HH:mm")} - Ksh {sale.total} via {sale.paymentMethod}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Top Selling */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">Top Selling Products</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="qty" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Breakdown */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">Sales by Payment Method</h2>
        <ul className="text-gray-700">
          {Object.entries(paymentStats).map(([method, total]) => (
            <li key={method}>
              <strong>{method}</strong>: Ksh {total.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Expiring Products */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-red-600 mb-3">Products Expiring in 7 Days</h2>
        {expiringProducts.length === 0 ? (
          <p className="text-gray-500">No products expiring soon.</p>
        ) : (
          <ul className="text-sm text-gray-700 list-disc pl-5">
            {expiringProducts.map((item, idx) => (
              <li key={idx}>
                {item.name} - expires on {dayjs(item.expiryDate).format("DD MMM YYYY")}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Sales Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">All Sales</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Date/Time</th>
              <th className="p-2">Items</th>
              <th className="p-2">Total (Ksh)</th>
              <th className="p-2">Payment</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="p-2">{dayjs(sale.date).format("DD MMM, HH:mm")}</td>
                <td className="p-2">
                  {sale.items.map((item, i) => (
                    <div key={i}>{item.name} x {item.qty}</div>
                  ))}
                </td>
                <td className="p-2">Ksh {sale.total}</td>
                <td className="p-2">{sale.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
