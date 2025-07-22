import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCart } from "../context/CartContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const { cartItems, addToCart, clearCart, total } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "inventory"));
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) {
      alert("Select a valid product and quantity.");
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) {
      alert("Product not found.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Only ${product.stock} in stock.`);
      return;
    }

    addToCart({ ...product, quantity });
    setSelectedProduct("");
    setQuantity(1);
  };

  const generateReceipt = (id) => {
    const doc = new jsPDF();
    doc.text("Customer Receipt", 80, 10);
    autoTable(doc, {
      head: [["Product", "Qty", "Price"]],
      body: cartItems.map((item) => [
        item.name,
        item.quantity,
        `Ksh ${item.price}`,
      ]),
    });
    doc.text(`Total: Ksh ${total}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Payment Method: ${payment}`, 14, doc.autoTable.previous.finalY + 20);
    doc.text(`Receipt ID: ${id}`, 14, doc.autoTable.previous.finalY + 30);
    doc.save(`receipt-${id}.pdf`);
  };

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

      for (const item of cartItems) {
        const ref = doc(db, "inventory", item.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const current = snap.data().stock || 0;
          const newStock = current - item.quantity;
          await updateDoc(ref, { stock: newStock < 0 ? 0 : newStock });
        }
      }

      alert(" Purchase successful");
      generateReceipt(docRef.id);
      clearCart();
    } catch (err) {
      alert(" Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Checkout</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Select Product
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">-- Choose Product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - Ksh {p.price} (Stock: {p.stock})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded p-2 w-1/3"
          placeholder="Quantity"
        />
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>

      {cartItems.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
            Cart Items
          </h3>
          <ul className="divide-y divide-gray-200 mb-4">
            {cartItems.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>Ksh {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mb-4 font-semibold text-right">
            Total: Ksh {total}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="Cash">Cash</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Visa Card">Visa Card</option>
            </select>
          </div>

          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
