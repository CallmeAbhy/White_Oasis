const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const { Admin, User, Manager } = require("../models/userModel");

const router = express.Router();

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

router.get("/profile/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the requesting user has access to this profile

    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Try to find the user in all collections

    let profile = await Admin.findById(id);

    if (!profile) {
      profile = await User.findById(id);
    }

    if (!profile) {
      profile = await Manager.findById(id);
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Convert profile to plain object to modify it

    profile = profile.toObject();

    // Add full URLs for files if they exist

    if (profile.role === "user") {
      if (profile.governmentIdCard) {
        profile.governmentIdCard = `${req.protocol}://${req.get("host")}/${
          profile.governmentIdCard
        }`;
      }

      if (profile.userPhoto) {
        profile.userPhoto = `${req.protocol}://${req.get("host")}/${
          profile.userPhoto
        }`;
      }
    } else if (profile.role === "manager") {
      if (profile.trust_logo) {
        profile.trust_logo = `${req.protocol}://${req.get("host")}/${
          profile.trust_logo
        }`;
      }

      if (profile.trust_document) {
        profile.trust_document = `${req.protocol}://${req.get("host")}/${
          profile.trust_document
        }`;
      }

      if (profile.financial_statements) {
        profile.financial_statements = `${req.protocol}://${req.get("host")}/${
          profile.financial_statements
        }`;
      }

      if (profile.trust_domicile) {
        profile.trust_domicile = `${req.protocol}://${req.get("host")}/${
          profile.trust_domicile
        }`;
      }
    }

    // Remove sensitive information

    delete profile.password;

    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error);

    res.status(500).json({
      message: "Error retrieving profile",

      error: error.message,
    });
  }
});

module.exports = router;
