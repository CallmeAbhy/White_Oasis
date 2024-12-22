const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");

const { sendContactMessage } = require("../controllers/contactController");

const router = express.Router();

router.post("/send", verifyToken, sendContactMessage);

module.exports = router;
