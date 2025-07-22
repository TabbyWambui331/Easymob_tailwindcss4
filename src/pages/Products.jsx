import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase"; // ✅ connect to Firestore

import {
  FaBoxOpen, FaUtensils, FaSoap, FaTshirt, FaLaptop, FaBook,
  FaHome, FaBaby, FaPills
} from "react-icons/fa";

const iconMap = {
  "Beverages": FaUtensils,
  "Snacks": FaUtensils,
  "Toiletries": FaSoap,
  "Groceries": FaUtensils,
  "Electronics": FaLaptop,
  "Fashion": FaTshirt,
  "Beauty & Personal Care": FaSoap,
  "Home & Kitchen": FaHome,
  "Toys & Games": FaBoxOpen,
  "Health": FaPills,
  "Baby Products": FaBaby,
  "Pet Supplies": FaBoxOpen,
  "Office Supplies": FaBook,
  "Books & Stationery": FaBook,
  "Cleaning Supplies": FaSoap,
  "Default": FaBoxOpen
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", serial: "",
    category: "Electronics", brand: "", status: "active", discount: 0
  });

  const categories = Object.keys(iconMap).filter(c => c !== "Default");
  const productsRef = collection(db, "products");

  // Fetch from Firebase
  const fetchProducts = async () => {
    const snapshot = await getDocs(productsRef);
    const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setProducts(items);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (editingId) {
      const ref = doc(db, "products", editingId);
      await updateDoc(ref, form);
    } else {
      await addDoc(productsRef, form);
    }
    resetForm();
    fetchProducts();
  };

  const handleEdit = product => {
    setEditingId(product.id);
    setForm({ ...product });
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const resetForm = () => {
    setForm({
      name: "", description: "", price: "", stock: "", serial: "",
      category: "Electronics", brand: "", status: "active", discount: 0
    });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>
      <div className="mb-4 flex justify-between items-center">
  <h2 className="text-xl font-semibold text-gray-800">Manage Your Products</h2>
  <button
    onClick={() => {
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
  >
    + Add New Product
  </button>
</div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border p-2 rounded" />
        <input name="serial" value={form.serial} onChange={handleChange} placeholder="Serial Number" className="border p-2 rounded" />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="border p-2 rounded" />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="border p-2 rounded" />
        <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" className="border p-2 rounded" />
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded">
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Product Description"
        className="w-full border p-2 rounded mb-4"
        rows="3"
      />

      <div className="flex gap-2 mb-8">
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Save Changes" : "Add Product"}
        </button>
        {editingId && (
          <button onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-2">Icon</th>
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Serial</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No products available.
                </td>
              </tr>
            ) : (
              products.map(p => {
                const Icon = iconMap[p.category] || iconMap["Default"];
                return (
                  <tr key={p.id} className="border-t hover:bg-blue-50">
                    <td className="p-2 text-center"><Icon className="text-blue-600 text-xl" /></td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">Ksh {p.price}</td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2">{p.serial}</td>
                    <td className="p-2">{p.brand}</td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
