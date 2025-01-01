// models/HomeContent.js
const mongoose = require("mongoose");

const imageReferenceSchema = new mongoose.Schema(
  {
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
    day: {
      type: String,
      enum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      required: true,
    },
  },
  { _id: false }
);

const videoReferenceSchema = new mongoose.Schema(
  {
    fileId: mongoose.Schema.Types.ObjectId,
    filename: String,
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    heroImages: {
      type: [imageReferenceSchema],
      validate: {
        validator: function (images) {
          if (images.length !== 7) return false;
          const days = images.map((img) => img.day);
          const uniqueDays = new Set(days);
          return uniqueDays.size === 7;
        },
        message: "Must have exactly 7 images, one for each day of the week",
      },
    },
    heroVideoBig: videoReferenceSchema,
    heroVideoSmall: videoReferenceSchema,
    title: String,
    subtitle: String,
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    address: String,
    facebook: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
