const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/verifyToken");

// ✅ GET: All products for logged-in business
router.get("/", verifyToken, async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { BusinessId: req.businessId },
      order: [["createdAt", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST: Add product to logged-in business
router.post("/", verifyToken, async (req, res) => {
  const { name, price, image, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const product = await Product.create({
      name,
      price,
      image,
      category,
      BusinessId: req.businessId, // link to logged-in business
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT: Update product (only if belongs to business)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, BusinessId: req.businessId },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    const { name, price, image, category } = req.body;

    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE: Remove product (only if belongs to business)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id, BusinessId: req.businessId },
    });

    if (!deleted) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
