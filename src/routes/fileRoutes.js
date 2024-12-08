// src/routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const { getGfs } = require("../config/gridfsConfig");

// Get file by filename
router.get("/file/:filename", async (req, res) => {
  try {
    const gfs = getGfs();
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file) {
      console.warn(`File not found: ${req.params.filename}`);
      return res.status(404).json({ error: "File not found" });
    }

    const readStream = gfs.createReadStream(file.filename);
    console.log(`File stream created for: ${file.filename}`);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Error retrieving file" });
  }
});

// Delete file
router.delete("/file/:filename", async (req, res) => {
  try {
    const gfs = getGfs();
    await gfs.files.deleteOne({ filename: req.params.filename });
    console.log(`File deleted: ${req.params.filename}`);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
});

module.exports = router;
