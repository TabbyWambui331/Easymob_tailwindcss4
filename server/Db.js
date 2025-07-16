const express = require('express');
const http = require('http'); // Required for Socket.IO
const socketIo = require('socket.io'); // Import Socket.IO
const Business = require("./models/Business");
const Category = require("./models/Category");
const Product = require("./models/Product");
const authRoutes = require("./routes/authRoutes");
const cors = require('cors'); // Add CORS for frontend-backend communication

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Adjust to your frontend URL
    methods: ['GET', 'POST'],
  }
}); // Initialize Socket.IO

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend origin

// Routes
app.use("/api/auth", authRoutes);

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Example: Handle cart updates
  socket.on('update-cart', async (cart) => {
    // Optionally save cart to database (e.g., Orders table)
    io.emit('cart-updated', cart); // Broadcast to all clients
  });

  // Example: Handle inventory updates
  socket.on('update-inventory', async (productId, newStock) => {
    try {
      await Product.update({ stock: newStock }, { where: { id: productId } });
      const updatedProduct = await Product.findByPk(productId);
      io.emit('inventory-updated', updatedProduct); // Broadcast update
    } catch (err) {
      console.error('Inventory update error:', err);
    }
  });

  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Sync Sequelize and Start Server
const sequelize = require('./config/database'); // Adjust path to your Sequelize config
sequelize.sync({ alter: true }) // or { force: true } for development only
  .then(() => {
    console.log("✅ All models synced.");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(console.error);

const PORT = process.env.PORT || 5000;