const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const { Admin, User, Manager } = require("../models/userModel");
const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Try to find the user in each collection
    let profile = await Admin.findById(userId);

    if (!profile) {
      profile = await User.findById(userId);
    }
    if (!profile) {
      profile = await Manager.findById(userId);
    }
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    // Remove sensitive information
    const { password, ...profileData } = profile.toObject();
    // Add role to response
    const response = {
      ...profileData,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Only Admin can access
router.get("/admin", verifyToken, authorizedRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});
// Both Admin and Manager can access
router.get(
  "/manager",
  verifyToken,
  authorizedRoles("admin", "manager"),
  (req, res) => {
    res.json({ message: "Welcome Manager" });
  }
);
// All can Access
router.get(
  "/user",
  verifyToken,
  authorizedRoles("admin", "manager", "user"),
  (req, res) => {
    res.json({ message: "Welcome User" });
  }
);

module.exports = router;
