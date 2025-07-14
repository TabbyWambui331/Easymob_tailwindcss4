import React, { useState, useEffect } from "react";

const Products = () => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Beverages",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const categories = ["Beverages", "Snacks", "Toiletries", "Groceries", "Electronics"];

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      fetchProducts();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: "", price: "", category: "Beverages", image: "" });
      setEditingId(null);
      fetchProducts();
    } else {
      alert("Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 rounded"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {form.image && (
        <div className="mb-4">
          <img src={form.image} alt="Preview" className="h-24 rounded shadow" />
        </div>
      )}

      <div className="flex gap-2 mb-8">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Save" : "Add Product"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setForm({ name: "", price: "", category: "Beverages", image: "" });
              setEditingId(null);
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    {p.image && <img src={p.image} alt={p.name} className="h-10 w-10 rounded" />}
                  </td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">Ksh {p.price}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
