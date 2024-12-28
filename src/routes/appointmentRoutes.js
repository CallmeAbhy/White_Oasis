// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const {
  createAppointment,
  updatetheAppointment,
  getAvailableSlots,
} = require("../controllers/appointmentController");

// Create appointment (for users)
router.post("/create", verifyToken, authorizedRoles("user"), createAppointment);
router.patch(
  "/:appointmentId/status",
  verifyToken,
  authorizedRoles("manager"),
  updatetheAppointment
);
router.get(
  "/available-slots/:oldAgeHomeId/:date",
  verifyToken,
  getAvailableSlots,
  authorizedRoles("user")
);

module.exports = router;
