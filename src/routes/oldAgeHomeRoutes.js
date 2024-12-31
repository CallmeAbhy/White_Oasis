const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizedRoles = require("../middlewares/roleMiddleware");
const {
  createOldAgeHome,
  getHomeReview,
  getAllOldAgeHomes,
  getOldAgeHomeById,
  updateRating,
  deleteOldAgeHome,
  deleteReview,
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
  "/homes/:id",
  verifyToken,
  authorizedRoles("manager", "user"),
  getOldAgeHomeById
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
router.delete(
  "/:homeId/reviews/:reviewId",
  verifyToken,
  authorizedRoles("user", "admin"),
  deleteReview
);
module.exports = router;
