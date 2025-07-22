// src/pages/Sales.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSales(salesData);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) return <p className="p-4">Loading sales...</p>;

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto text-blue-800">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">📈 Sales Records</h2>

      {sales.length === 0 ? (
        <p className="text-gray-500 text-lg">No sales have been recorded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-xl shadow-md p-4 border">
              <h3 className="text-lg font-semibold mb-2">🧾 Receipt ID: {sale.id}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Payment Method: <span className="font-medium capitalize">{sale.paymentMethod}</span>
              </p>
              <p className="text-sm text-gray-600 mb-3">Total: Ksh {sale.total.toFixed(2)}</p>
              <ul className="text-sm text-gray-700 list-disc list-inside mb-2">
                {sale.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - Ksh {item.price} x {item.quantity || 1}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400">{sale.createdAt?.toDate?.().toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Export Sales
        </button>
      </div>
    </div>
  );
};

export default Sales;
