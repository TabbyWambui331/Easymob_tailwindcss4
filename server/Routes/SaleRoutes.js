const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const verifyToken = require("../middleware/verifyToken");

// POST: Save a sale
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, total, paymentMethod } = req.body;

    const sale = await Sale.create({
      items,
      total,
      paymentMethod,
      BusinessId: req.businessId,
    });

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get sales history for logged-in business
router.get("/", verifyToken, async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: { BusinessId: req.businessId },
      order: [["createdAt", "DESC"]],
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
