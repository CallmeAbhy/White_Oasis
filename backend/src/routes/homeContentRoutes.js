// routes/homeContentRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/gridfsConfig");
const {
  updateHomeContent,
  getHomeContent,
  getFile,
  resetHomeContentController,
} = require("../controllers/homeContentController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");

// Configure multer with GridFS storage
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "heroImages", maxCount: 7 },
  { name: "heroVideoBig", maxCount: 1 },
  { name: "heroVideoSmall", maxCount: 1 },
]);

router.post(
  "/update",
  verifyToken,
  authorizedRoles("admin"),
  uploadFields,
  updateHomeContent
);

router.get("/", getHomeContent);
router.get("/files/:fileId", getFile);
router.post(
  "/reset",
  verifyToken,
  authorizedRoles("admin"),
  resetHomeContentController
);
module.exports = router;
