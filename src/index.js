const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const fileRoutes = require("./routes/fileRoutes");
const oldAgeHomeRoutes = require("./routes/oldAgeHomeRoutes");
const cors = require("cors");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const contactRoutes = require("./routes/contactRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { initGridFS } = require("./config/gridfsConfig");
dbConnect();
const app = express();
// Middleware
app.use(express.json());
app.use(cors());
initGridFS(
  "mongodb+srv://white:wash@cluster0.4hmjb.mongodb.net/White_Orchid?retryWrites=true&w=majority&appName=Cluster0"
);
//  Routes
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use("/api/old-age-homes", oldAgeHomeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Starts the Server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server is running at port  ${PORT}`);
});
// https://www.blackbox.ai/chat/Bh6RhGD
// https://www.blackbox.ai/chat/J1nm8rv
