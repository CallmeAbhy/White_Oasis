// src/routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const { getGfs } = require("../config/gridfsConfig");

// Get file by filename
router.get("/file/:filename", async (req, res) => {
  try {
    const gfs = getGfs();

    if (!gfs) {
      return res.status(500).json({ error: "GridFS not initialized" });
    }

    const file = await gfs.find({ filename: req.params.filename }).toArray();

    if (!file || file.length === 0) {
      console.warn(`File not found: ${req.params.filename}`);
      return res.status(404).json({ error: "File not found" });
    }

    // Set the proper content type
    res.set("Content-Type", file[0].contentType);

    // Create a read stream using the file's _id
    const readStream = gfs.openDownloadStream(file[0]._id);

    console.log(`File stream created for: ${file[0].filename}`);

    // Pipe the read stream to the response
    readStream.pipe(res);

    // Handle stream errors
    readStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      res.status(500).json({ error: "Error streaming file" });
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Error retrieving file" });
  }
});

// Delete file
router.delete("/file/:filename", async (req, res) => {
  try {
    const gfs = getGfs();
    const file = await gfs.find({ filename: req.params.filename }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    await gfs.delete(file[0]._id);
    console.log(`File deleted: ${req.params.filename}`);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
});

module.exports = router;
