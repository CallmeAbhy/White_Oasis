const multer = require("multer");
const path = require("path");
const { storage } = require("../config/gridfsConfig");
// Configure storage

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Make sure this directory exists
//   },

//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// File filter

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    console.log(`File Type accepted : ${file.mimetype} `);
    cb(null, true);
  } else {
    console.warn(`Rejected file type: ${file.mimetype}`);
    cb(
      new Error("Invalid file type. Only JPEG, PNG and PDF files are allowed."),
      false
    );
  }
};

// Configure upload middleware

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    fileSize: (req, file) => {
      if (file.fieldname.includes("Video")) {
        return 50 * 1024 * 1024; // 50MB limit for videos
      }
      return 5 * 1024 * 1024; // 5MB limit for images
    },
  },
});

module.exports = upload;
