// controllers/aboutContentController.js
const AboutContent = require("../models/AboutContent");
const { getGfs } = require("../config/gridfsConfig");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const updateAboutContent = async (req, res) => {
  try {
    const { description } = req.body;
    const files = req.files;

    // Validate required files
    if (
      !files ||
      !files.images ||
      files.images.length < 3 ||
      files.images.length > 5
    ) {
      return res.status(400).json({
        message: "Please provide between 3 and 5 images",
      });
    }

    // Process images
    const images = files.images.map((file, index) => ({
      fileId: file.id,
      filename: file.filename,
      order: index + 1,
    }));

    // Process optional videos
    const videos = files.videos
      ? files.videos.map((file, index) => ({
          fileId: file.id,
          filename: file.filename,
          order: index + 1,
        }))
      : [];

    // Update or create about content
    const aboutContent = await AboutContent.findOneAndUpdate(
      { isActive: true },
      {
        description,
        images,
        videos,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "About content updated successfully",
      aboutContent: {
        description: aboutContent.description,
        imagesCount: aboutContent.images.length,
        videosCount: aboutContent.videos.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAboutContent = async (req, res) => {
  try {
    const gfs = getGfs();
    const aboutContent = await AboutContent.findOne({ isActive: true });

    if (!aboutContent) {
      return res.status(404).json({ message: "About content not found" });
    }

    // Prepare response with file URLs
    const response = {
      description: aboutContent.description,
      images: aboutContent.images.map((img) => ({
        fileId: img.fileId,
        filename: img.filename,
        order: img.order,
        url: `http://localhost:7001/api/aboutus/files/${img.fileId}`,
      })),
      videos: aboutContent.videos.map((vid) => ({
        fileId: vid.fileId,
        filename: vid.filename,
        order: vid.order,
        url: `http://localhost:7001/api/aboutus/files/${vid.fileId}`,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getFile = async (req, res) => {
  try {
    const gfs = getGfs();
    const fileId = new ObjectId(req.params.fileId);

    const file = await gfs.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const readStream = gfs.openDownloadStream(fileId);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const resetAboutContent = async (req, res) => {
  try {
    await AboutContent.deleteMany({});
    res.status(200).json({ message: "About Us Content Reset is Done" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateAboutContent,
  getAboutContent,
  resetAboutContent,
  getFile,
};
