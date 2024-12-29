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
  getusernotificationcount,
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
  "/user/all-status",
  verifyToken,
  authorizedRoles("user"),
  getusernotificationcount
);

module.exports = router;
