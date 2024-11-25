const express = require("express");
const {
  getPendingManagers,
  approveManager,
  rejectManager,
} = require("../controllers/adminController");
const verifyToken = require("../middlewares/authMiddleware"); // Import the JWT verification middleware
const authorizedRoles = require("../middlewares/roleMiddleware"); // Import the role-based authorization middleware
const router = express.Router();

// Get all pending manager requests
router.get(
  "/pending-managers",
  verifyToken,
  authorizedRoles("admin"),
  getPendingManagers
);

// Approve a pending manager
router.post(
  "/approve-manager/:id",
  verifyToken,
  authorizedRoles("admin"),
  approveManager
);

// Reject a pending manager
router.post(
  "/reject-manager/:id",
  verifyToken,
  authorizedRoles("admin"),
  rejectManager
);

module.exports = router;
