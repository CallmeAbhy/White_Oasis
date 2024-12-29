// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const {
  createAppointment,
  updatetheAppointment,
  getAvailableSlots,
  getAppointments,
  getuserAppointments,
  getUserNotificationCount,
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
  authorizedRoles("user"),
  getAvailableSlots
);
router.get(
  "/pending/:status",
  verifyToken,
  authorizedRoles("manager"),
  getAppointments
);
router.get(
  "/user/:status",
  verifyToken,
  authorizedRoles("user"),
  getuserAppointments
);
router.get(
  "/notifications/count",
  verifyToken,
  authorizedRoles("user"),
  getUserNotificationCount
);

module.exports = router;
