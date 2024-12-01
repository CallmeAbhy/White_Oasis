const mongoose = require("mongoose");

const commonFields = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "user", "manager"] },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
};

const adminSchema = new mongoose.Schema(
  {
    ...commonFields,
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    ...commonFields,
    address: { type: String, required: true },
    city: { type: String, required: true },
    governmentIdCard: { type: String, required: true },
    yourPhoto: { type: String, required: true }, // Assuming this is a URL or path to the photo
  },
  { timestamps: true }
);
const managerSchema = new mongoose.Schema(
  {
    ...commonFields,
    organization_name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    governmentIssuedPhotoId: { type: String, required: true },
    proofOfIncome: { type: String, required: true }, // Assuming this is a URL or path to the document
    proofOfResidency: { type: String, required: true }, // Assuming this is a URL or path to the document
    oldAgeHomePhoto: { type: String, required: true }, // Assuming this is a URL or path to the photo
  },
  { timestamps: true }
);
const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Manager = mongoose.model("Manager", managerSchema);
module.exports = { Admin, User, Manager };
