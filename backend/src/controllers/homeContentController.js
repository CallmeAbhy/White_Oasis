// controllers/homeContentController.js
const HomeContent = require("../models/HomeContent");
const { getGfs } = require("../config/gridfsConfig");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const updateHomeContent = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      email,
      phone,
      address,
      facebook,
      instagram,
      twitter,
      youtube,
    } = req.body;
    const files = req.files;

    if (!files || !files.heroImages || files.heroImages.length !== 7) {
      return res.status(400).json({
        message: "Please provide exactly 7 images for each day of the week",
      });
    }

    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    // Create heroImages array with GridFS references
    const heroImages = files.heroImages.map((file, index) => ({
      fileId: file.id,
      filename: file.filename,
      day: daysOfWeek[index],
    }));

    // Handle video uploads
    const heroVideoBig = files.heroVideoBig?.[0]
      ? {
          fileId: files.heroVideoBig[0].id,
          filename: files.heroVideoBig[0].filename,
        }
      : undefined;

    const heroVideoSmall = files.heroVideoSmall?.[0]
      ? {
          fileId: files.heroVideoSmall[0].id,
          filename: files.heroVideoSmall[0].filename,
        }
      : undefined;

    const homeContent = await HomeContent.findOneAndUpdate(
      { isActive: true },
      {
        title,
        subtitle,
        heroImages,
        email,
        phone,
        address,
        facebook,
        instagram,
        twitter,
        youtube,
        ...(heroVideoBig && { heroVideoBig }),
        ...(heroVideoSmall && { heroVideoSmall }),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Home content updated successfully",
      homeContent: {
        title: homeContent.title,
        subtitle: homeContent.subtitle,
        imagesCount: homeContent.heroImages.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHomeContent = async (req, res) => {
  try {
    const gfs = getGfs();
    const homeContent = await HomeContent.findOne({ isActive: true });

    if (!homeContent) {
      return res.status(404).json({ message: "Home content not found" });
    }

    // Get current day's image reference
    const dayIndex = new Date().getDay();
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const currentDay = daysOfWeek[dayIndex];
    const currentImage = homeContent.heroImages.find(
      (img) => img.day === currentDay
    );

    // Stream the current day's image
    const imageStream = gfs.openDownloadStream(currentImage.fileId);

    // Set appropriate headers
    res.set("Content-Type", "application/json");

    // Prepare response with file streams
    const response = {
      title: homeContent.title,
      subtitle: homeContent.subtitle,
      email: homeContent?.email || "",
      phone: homeContent?.phone || "",
      address: homeContent?.address || "",
      facebook: homeContent?.facebook || "",
      instagram: homeContent?.instagram || "",
      twitter: homeContent?.twitter || "",
      youtube: homeContent?.youtube || "",
      currentDayImage: {
        fileId: currentImage.fileId,
        filename: currentImage.filename,
        day: currentDay,
        url: `${process.env.API_URL}/api/landing/files/${currentImage.fileId}`,
      },
    };

    if (homeContent.heroVideoBig) {
      response.heroVideoBig = {
        fileId: homeContent.heroVideoBig.fileId,
        filename: homeContent.heroVideoBig.filename,
        url: `${process.env.API_URL}/api/landing/files/${homeContent.heroVideoBig.fileId}`,
      };
    }

    if (homeContent.heroVideoSmall) {
      response.heroVideoSmall = {
        fileId: homeContent.heroVideoSmall.fileId,
        filename: homeContent.heroVideoSmall.filename,
        url: `${process.env.API_URL}/api/landing/files/${homeContent.heroVideoSmall.fileId}`,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new endpoint to stream files
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
const resetHomeContentController = async (req, res) => {
  try {
    await HomeContent.deleteMany({});
    res.status(200).json({ message: "Home content reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateHomeContent,
  getHomeContent,
  getFile,
  resetHomeContentController,
};
