// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const { createAppointment } = require("../controllers/appointmentController");

// Create appointment (for users)
router.post("/create", verifyToken, authorizedRoles("user"), createAppointment);

module.exports = router;
