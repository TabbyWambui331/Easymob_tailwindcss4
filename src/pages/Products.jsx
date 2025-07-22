import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", serial: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const productsRef = collection(db, "products");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(productsRef);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  const resetForm = () => {
    setForm({ name: "", price: "", stock: "", serial: "", category: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock || !form.serial || !form.category) {
      alert("All fields are required.");
      return;
    }

    try {
      if (editingId) {
        const ref = doc(db, "products", editingId);
        await updateDoc(ref, form);
        alert("Product updated successfully!");
      } else {
        const snapshot = await getDocs(productsRef);
        const serialExists = snapshot.docs.some(doc => doc.data().serial === form.serial);
        if (serialExists) {
          alert("A product with this serial number already exists.");
          return;
        }
        await addDoc(productsRef, form);
        alert("Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save product.");
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Manage Products</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg mb-10 border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">{editingId ? "Edit Product" : "Add New Product"}</h2>
        <div className="grid gap-4">
          <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded outline-blue-400" />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="p-2 border rounded outline-blue-400" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="p-2 border rounded outline-blue-400" />
          <input type="text" placeholder="Serial Number" value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} className="p-2 border rounded outline-blue-400" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="p-2 border rounded outline-blue-400">
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Groceries">Groceries</option>
            <option value="Clothing">Clothing</option>
            <option value="Beverages">Beverages</option>
          </select>
          <button type="submit" className="bg-blue-700 text-blue py-2 rounded hover:bg-blue-800 transition">
            {editingId ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>

      {/* Product List */}
      <div className="bg-white p-6 rounded shadow-md border border-blue-200">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Product List</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-blue-900">
                <th className="py-2">Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Serial</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="py-2">{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.serial}</td>
                  <td>{product.category}</td>
                  <td className="space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
