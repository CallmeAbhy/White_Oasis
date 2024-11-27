const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const router = express.Router();
// Only Admin can access
router.get("/admin", verifyToken, authorizedRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});
// Both Admin and Manager can access
router.get(
  "/manager",
  verifyToken,
  authorizedRoles("admin", "manager"),
  (req, res) => {
    res.json({ message: "Welcome Manager", user: req.user });
  }
);
// All can Access
router.get(
  "/user",
  verifyToken,
  authorizedRoles("admin", "manager", "user"),
  (req, res) => {
    res.json({ message: "Welcome User", user: req.user });
  }
);

module.exports = router;
