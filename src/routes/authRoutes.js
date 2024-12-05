const express = require("express");
const { register, login } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const managerFields = [
  { name: "governmentIssuedPhotoId", maxCount: 1 },
  { name: "proofOfIncome", maxCount: 1 },
  { name: "proofOfResidency", maxCount: 1 },
  { name: "oldAgeHomePhoto", maxCount: 1 },
];

const userFields = [
  { name: "governmentIdCard", maxCount: 1 },
  { name: "yourPhoto", maxCount: 1 },
];
const router = express.Router();
router.post(
  "/register",
  upload.fields([...managerFields, ...userFields]),
  register
);
router.post("/login", login);

module.exports = router;
