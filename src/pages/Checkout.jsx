import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { jsPDF } from "jspdf";
import socket from "../socket"; //  Socket.IO import

const Checkout = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [payment, setPayment] = useState("cash");
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  const generateReceipt = (receiptId) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Easymob POS - Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Receipt ID: ${receiptId}`, 20, 30);
    doc.text(`Payment Method: ${payment}`, 20, 38);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 46);

    let y = 60;
    cartItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - Ksh ${item.price}`, 20, y);
      y += 8;
    });

    doc.text(`Total: Ksh ${total.toFixed(2)}`, 20, y + 10);
    doc.save(`receipt_${receiptId}.pdf`);
  };

  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cartItems,
          total,
          paymentMethod: payment,
        }),
      });

      if (!res.ok) throw new Error("Failed to confirm purchase");
      const data = await res.json();

      //  Real-time sale event
      socket.emit("sale-made", {
        id: data.id,
        items: cartItems,
        total,
        paymentMethod: payment,
        date: new Date().toISOString(),
      });

      alert(` Purchase saved! Receipt ID: ${data.id}`);
      generateReceipt(data.id);
      clearCart();
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🛒 Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <table className="w-full mb-4">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">Product</th>
                <th className="p-2">Price</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">Ksh {item.price}</td>
                  <td className="p-2">
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

          <div className="mb-4">
            <label className="block font-semibold mb-1">Select Payment Method:</label>
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

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Total: Ksh {total.toFixed(2)}</h3>
            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Purchase & Download Receipt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
