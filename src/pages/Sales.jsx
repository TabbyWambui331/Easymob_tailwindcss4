import React, { useEffect, useState } from "react";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const storedSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(storedSales.reverse()); // newest first
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Sales History</h1>

      {sales.length === 0 ? (
        <p className="text-gray-500">No sales recorded yet.</p>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow">
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
                  <td className="p-2">{sale.date}</td>
                  <td className="p-2">
                    {sale.items.map((item, i) => (
                      <div key={i}>
                        {item.name} x {item.qty}
                      </div>
                    ))}
                  </td>
                  <td className="p-2">Ksh {sale.total}</td>
                  <td className="p-2">{sale.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
