require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/products", require("./routes/ProductRoutes"));
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/orders", require("./routes/OrderRoutes"));

// ✅ Root route (ADD THIS HERE)
app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});