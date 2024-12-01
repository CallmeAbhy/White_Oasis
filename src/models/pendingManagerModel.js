const mongoose = require("mongoose");

const pendingManagerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    organization_name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    governmentIssuedPhotoId: {
      type: String,
      required: true,
    },
    proofOfIncome: {
      type: String,
      required: true,
    },
    proofOfResidency: {
      type: String,
      required: true,
    },
    oldAgeHomePhoto: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    feedback: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PendingManager", pendingManagerSchema);
