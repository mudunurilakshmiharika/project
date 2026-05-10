const path = require("path");
require("dns").setServers(["8.8.8.8"]); // 🌐 Required to resolve your mongodb+srv string locally
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();

// ✅ Connect MongoDB
// ✅ Connect MongoDB (now handled in startServer)

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/products", require("./routes/ProductRoutes"));
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/orders", require("./routes/OrderRoutes"));

// ⭐ ADD PAYMENT ROUTE HERE
app.use("/api/payment", require("./routes/paymentRoutes"));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Connect MongoDB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection error:", error);
    process.exit(1);
  }
};

startServer();