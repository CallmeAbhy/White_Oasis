// models/AboutContent.js
const mongoose = require("mongoose");

// Schema for image references
const imageReferenceSchema = new mongoose.Schema(
  {
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
    order: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false }
);

// Schema for video references
const videoReferenceSchema = new mongoose.Schema(
  {
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
    order: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },
  },
  { _id: false }
);

const aboutContentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [imageReferenceSchema],
      validate: {
        validator: function (images) {
          // Validate number of images (3-5)
          if (images.length < 3 || images.length > 5) return false;

          // Check for unique order values
          const orders = images.map((img) => img.order);
          const uniqueOrders = new Set(orders);
          return uniqueOrders.size === orders.length;
        },
        message: "Must have between 3 and 5 images with unique order values",
      },
    },
    videos: {
      type: [videoReferenceSchema],
      validate: {
        validator: function (videos) {
          // Validate number of videos (0-2)
          if (videos.length > 2) return false;

          // Check for unique order values
          const orders = videos.map((vid) => vid.order);
          const uniqueOrders = new Set(orders);
          return uniqueOrders.size === orders.length;
        },
        message: "Cannot have more than 2 videos and orders must be unique",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure only one active document exists
aboutContentSchema.pre("save", async function (next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

module.exports = mongoose.model("AboutContent", aboutContentSchema);
