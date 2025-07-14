const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Business = require("../models/Business");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await Business.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already used" });

    const business = await Business.create({ name, email, password });

    const token = jwt.sign({ id: business.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, business: { id: business.id, name: business.name, email: business.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const business = await Business.findOne({ where: { email } });
    if (!business) return res.status(404).json({ error: "Business not found" });

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: business.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, business: { id: business.id, name: business.name, email: business.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Logged-in Business
const verifyToken = require("../middleware/verifyToken");

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const business = await Business.findByPk(req.businessId);
    res.json({ business });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
