// src/config/gridfsConfig.js
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const crypto = require("crypto");
const path = require("path");

let gfs;

// Initialize GridFS
const initGridFS = (mongoURI) => {
  const conn = mongoose.createConnection(mongoURI);

  conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("GridFS initialized successfully");
  });

  return gfs;
};

// Create storage engine
//For someone using mongodb as database. I am using the mongodb connection string and I refer to it via .env variable. Since .gitignore is not pushing this .env variable, it happens that this connection string is missing. You can fix this by basically adding your connection string back into your .env file.

const storage = new GridFsStorage({
  url: "mongodb+srv://white:wash@cluster0.4hmjb.mongodb.net/White_Orchid?retryWrites=true&w=majority&appName=Cluster0",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.error("Error generating filename:", err);
          return reject(err);
        }

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          metadata: {
            originalname: file.originalname,
            fieldname: file.fieldname,
            uploadedBy: req.body.username || "unknown",
          },
        };

        console.log(`File prepared for upload: ${filename}`);
        resolve(fileInfo);
      });
    });
  },
});

module.exports = { initGridFS, storage, getGfs: () => gfs };
