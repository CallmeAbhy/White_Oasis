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
    name_of_trust: {
      type: String,
      required: true,
    },
    head_office_address: {
      type: String,
      required: true,
    },
    head_office_city: {
      type: String,
      required: true,
    },
    head_office_country: {
      type: String,
      required: true,
    },
    head_office_state: {
      type: String,
      required: true,
    },
    trust_document: {
      type: String,
      required: true,
    },
    financial_statements: {
      type: String,
      required: true,
    },
    trust_domicile: {
      type: String,
      required: true,
    },
    trust_logo: {
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
