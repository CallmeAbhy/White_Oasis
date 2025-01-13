// routes/aboutContentRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/gridfsConfig");
const {
  updateAboutContent,
  getAboutContent,
  resetAboutContent,
  getFile,
} = require("../controllers/aboutContentController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");

// Configure multer with GridFS storage
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 2 },
]);

// Routes
router.post(
  "/update",
  verifyToken,
  authorizedRoles("admin"),
  uploadFields,
  updateAboutContent
);

router.get("/", getAboutContent);
router.post("/reset", verifyToken, authorizedRoles("admin"), resetAboutContent);
router.get("/files/:fileId", getFile);

module.exports = router;
