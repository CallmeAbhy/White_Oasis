// models/appointmentModel.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    old_age_home_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OldAgeHome",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment_type: {
      type: String,
      enum: ["Adoption", "Enquiry", "Visit"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    appointment_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    feedback: String,
    user_profile: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
appointmentSchema.index({ old_age_home_id: 1, start_time: 1, end_time: 1 });
module.exports = mongoose.model("Appointment", appointmentSchema);
