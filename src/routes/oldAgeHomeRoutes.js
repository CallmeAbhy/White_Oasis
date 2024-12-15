const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const {
  createOldAgeHome,
  getHomeReview,
  getAllOldAgeHomes,
  getManagerOldAgeHomes,
  updateRating,
  deleteOldAgeHome,
} = require("../controllers/oldAgeHomeController");
const router = express.Router();
router.post(
  "/create",
  verifyToken,
  authorizedRoles("manager"),
  createOldAgeHome
);
router.get("/all", getAllOldAgeHomes);
router.get(
  "/manager-homes/:id",
  verifyToken,
  authorizedRoles("manager", "user"),
  getManagerOldAgeHomes
);

router.post(
  "/rate/:homeId",
  verifyToken,
  authorizedRoles("user", "admin"),
  updateRating
);
router.get(
  "/getreviews/:homeId",
  verifyToken,
  authorizedRoles("user", "admin"),
  getHomeReview
);
router.delete(
  "/delete/:id",
  verifyToken,
  authorizedRoles("manager", "admin"),
  deleteOldAgeHome
);
module.exports = router;
