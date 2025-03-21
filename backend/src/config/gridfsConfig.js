// src/config/gridfsConfig.js
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const crypto = require("crypto");
const path = require("path");

let gfs;

// Initialize GridFS
const initGridFS = (mongoURI) => {
  const conn = mongoose.createConnection(mongoURI, {});

  conn.once("open", () => {
    gfs = new GridFSBucket(conn.db, {
      bucketName: "uploads",
    });
    console.log("GridFS initialized successfully");
  });

  return gfs;
};

// Create storage engine
const storage = new GridFsStorage({
  url: "mongodb+srv://project:pwd@cluster0.0esk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.error("Error generating filename:", err);
          return reject(err);
        }

        const filename = buf.toString("hex") + path.extname(file.originalname);
        // const fileInfo = {
        //   filename: filename,
        //   bucketName: "uploads",
        //   metadata: {
        //     originalname: file.originalname,
        //     fieldname: file.fieldname,
        //     uploadedBy: req.body.username || "unknown",
        //   },
        // };
        const metadata = {
          originalname: file.originalname,

          fieldname: file.fieldname,

          contentType: "home-content",

          fileType: file.fieldname.includes("Video") ? "video" : "image",

          uploadedAt: new Date(),
        };

        // If it's a hero image, add the day information

        if (file.fieldname === "heroImages") {
          const dayIndex = parseInt(file.originalname.split("-")[0]);

          const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];

          metadata.day = days[dayIndex];
        }

        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          metadata: metadata,
        };

        console.log(`File prepared for upload: ${filename}`, metadata);
        resolve(fileInfo);
      });
    });
  },
});
// Add function to delete old files
const deleteFile = async (fileId) => {
  if (!gfs) {
    throw new Error("GridFS not initialized");
  }
  try {
    await gfs.delete(new mongoose.Types.ObjectId(fileId));
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
const getFileStream = async (fileId) => {
  if (!gfs) {
    throw new Error("GridFS not initialized");
  }

  try {
    return gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));
  } catch (error) {
    console.error("Error getting file stream:", error);

    throw error;
  }
};
module.exports = {
  initGridFS,
  storage,
  getGfs: () => gfs,
  deleteFile,
  getFileStream,
};
