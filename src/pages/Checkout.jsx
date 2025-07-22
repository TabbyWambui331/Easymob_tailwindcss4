import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { jsPDF } from "jspdf";
import socket from "../socket";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const Checkout = () => {
  const { cartItems, total, clearCart, removeFromCart } = useContext(CartContext);
  const [payment, setPayment] = useState("cash");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "sales"), {
        items: cartItems,
        total,
        paymentMethod: payment,
        createdAt: serverTimestamp(),
      });

      alert(`✅ Purchase completed! Receipt ID: ${docRef.id}`);
      generateReceipt(docRef.id);
      clearCart();
    } catch (err) {
      alert("❌ Error saving to Firebase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (id) => {
    const doc = new jsPDF();
    doc.text("🧾 EasyMobPOS Receipt", 10, 10);
    doc.text(`Receipt ID: ${id}`, 10, 20);

    cartItems.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.name} - Ksh ${item.price}`, 10, 30 + i * 10);
    });

    doc.text(`Total: Ksh ${total}`, 10, 30 + cartItems.length * 10 + 10);
    doc.save("receipt.pdf");
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto text-blue-800">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">🛍️ Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg">No items in cart.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border mb-6 text-sm md:text-base">
              <thead className="bg-blue-100 text-left">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">Ksh {item.price}</td>
                    <td className="p-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Payment Method</label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="border p-2 rounded w-full md:w-1/3"
            >
              <option value="cash">Cash</option>
              <option value="mpesa">M-Pesa</option>
              <option value="visa">Visa Card</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4">
            <h3 className="text-xl font-bold">Total: Ksh {total.toFixed(2)}</h3>
            <button
              onClick={handleConfirm}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm & Generate Receipt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
