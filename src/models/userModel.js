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
    country: { type: String, required: true },
    state: { type: String, required: true },
    governmentIdCard: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    userPhoto: { type: String, required: true }, // Assuming this is a URL or path to the photo
  },
  { timestamps: true }
);
const managerSchema = new mongoose.Schema(
  {
    ...commonFields,
    name_of_trust: { type: String, required: true },
    head_office_address: { type: String, required: true },
    head_office_city: { type: String, required: true },
    head_office_country: { type: String, required: true },
    head_office_state: { type: String, required: true },
    trust_document: { type: String, required: true },
    financial_statements: { type: String, required: true }, // Assuming this is a URL or path to the document
    trust_domicile: { type: String, required: true }, // Assuming this is a URL or path to the document
    trust_logo: { type: String, required: true }, // Assuming this is a URL or path to the photo
    yearOfEstablishment: { type: Number, required: true },
  },
  { timestamps: true }
);
const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Manager = mongoose.model("Manager", managerSchema);
module.exports = { Admin, User, Manager };
