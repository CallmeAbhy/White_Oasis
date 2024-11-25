const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
dbConnect();
const app = express();
// Middleware
app.use(express.json());
//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/password-reset", passwordResetRoutes);
// Starts the Server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server is running at port  ${PORT}`);
});
// https://www.blackbox.ai/chat/Bh6RhGD
