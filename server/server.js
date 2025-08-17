require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));

// Health check
app.get("/", (req, res) => res.status(200).json({ status: "OK" }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));