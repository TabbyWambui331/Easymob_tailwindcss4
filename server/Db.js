const Business = require("./models/Business");
const Category = require("./models/Category");
const Product = require("./models/Product");
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);


// Sync
sequelize.sync({ alter: true }) // or { force: true } for development only
  .then(() => {
    console.log("✅ All models synced.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
