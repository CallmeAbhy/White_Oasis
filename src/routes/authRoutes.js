const express = require("express");
const { register, login } = require("../controllers/authController");
const multer = require("multer");
const {
  uploadImages,
  uploadDocuments,
} = require("../middlewares/uploadMiddleware");

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
const upload = {
  user: uploadImages.fields(userFields),
  manager: multer().fields(managerFields),
};

const router = express.Router();
router.post("/register", (req, res, next) => {
  const role = req.body.role;
  if (role === "user") {
    upload.user(req, res, next);
  } else if (role === "manager") {
    upload.manager(req, res, next);
  } else {
    next();
  }
});
router.post("/login", login);

module.exports = router;
