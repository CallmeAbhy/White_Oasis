const express = require("express");
const { register, login } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");
const managerFields = [
  { name: "trust_document", maxCount: 1 },
  { name: "financial_statements", maxCount: 1 },
  { name: "trust_domicile", maxCount: 1 },
  { name: "trust_logo", maxCount: 1 },
];

const userFields = [
  { name: "governmentIdCard", maxCount: 1 },
  { name: "userPhoto", maxCount: 1 },
];
const router = express.Router();
router.post(
  "/register",
  upload.fields([...managerFields, ...userFields]),
  register
);
router.post("/login", login);

module.exports = router;
