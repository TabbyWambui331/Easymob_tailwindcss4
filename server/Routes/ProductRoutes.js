// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ POST /api/products — Add a new product
router.post("/", async (req, res) => {
  try {
    const { name, price, category, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const newProduct = await Product.create({
      name,
      price,
      category,
      image,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/products — Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/products/:id — Get a single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT /api/products/:id — Update a product
router.put("/:id", async (req, res) => {
  try {
    const { name, price, category, image } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image = image || product.image;

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE /api/products/:id — Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
