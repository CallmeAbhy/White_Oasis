const OldAgeHome = require("../models/oldAgeHomeModel");
const { User, Manager, Admin } = require("../models/userModel");

const createOldAgeHome = async (req, res) => {
  try {
    const {
      old_age_home_name,
      old_age_home_country,
      old_age_home_city,
      old_age_home_state,
      old_age_home_address,
      old_age_home_upi_id,
      opens_on,
      closes_on,
      working_days,
      is_appointment_enabled,
    } = req.body;
    const manager_id = req.user.id;
    const manager = await Manager.findById(manager_id);
    if (!manager) {
      return res
        .status(403)
        .json({ message: "Only managers can create old-age homes" });
    }
    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(opens_on) || !timeRegex.test(closes_on)) {
      return res.status(400).json({
        message: "Invalid time format. Please use HH:mm format (24-hour)",
      });
    }

    // Validate working days

    if (!Array.isArray(working_days) || working_days.length === 0) {
      return res.status(400).json({
        message: "Working days must be specified as an array of valid days",
      });
    }

    const newOldAgeHome = new OldAgeHome({
      old_age_home_name,
      old_age_home_country,
      old_age_home_city,
      old_age_home_state,
      old_age_home_address,
      old_age_home_upi_id,
      manager_id,
      opens_on,
      closes_on,
      working_days,
      is_appointment_enabled,
    });
    await newOldAgeHome.save();
    res.status(201).json({
      message: "Old-age home Posted successfully",
      oldAgeHome: newOldAgeHome,
    });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};
// Get all old-age homes

const getAllOldAgeHomes = async (req, res) => {
  try {
    const oldAgeHomes = await OldAgeHome.find();
    res.status(200).json(oldAgeHomes);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};
// Get old-age homes by manager

const getManagerOldAgeHomes = async (req, res) => {
  try {
    const { id } = req.params;
    const manager_id = id;
    const oldAgeHomes = await OldAgeHome.find({ manager_id });
    res.status(200).json(oldAgeHomes);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};
const updateRating = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;
    let user = await User.findById(userId);
    if (!user) {
      user = await Admin.findById(userId);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    const oldAgeHome = await OldAgeHome.findById(homeId);
    if (!oldAgeHome) {
      return res.status(404).json({ message: "Old-age home not found" });
    }
    const newNumRating = oldAgeHome.num_rating + 1;
    const newAvgRating =
      (oldAgeHome.avg_rating * oldAgeHome.num_rating + rating) / newNumRating;
    // Update the fields
    oldAgeHome.avg_rating = newAvgRating;
    oldAgeHome.num_rating = newNumRating;
    // Add new review if provided
    if (review && review.trim()) {
      const newReview = {
        username: user.username,
        review: review.trim(),
        timestamp: new Date(),
      };

      oldAgeHome.num_review.push(newReview);
    }
    await oldAgeHome.save();
    res.status(200).json({
      message: "Rating and review updated successfully",
      oldAgeHome,
    });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};
// Get home reviews

const getHomeReview = async (req, res) => {
  try {
    const { homeId } = req.params;

    const oldAgeHome = await OldAgeHome.findById(homeId);

    if (!oldAgeHome) {
      return res.status(404).json({ message: "Old-age home not found" });
    }
    // Sort reviews by timestamp in descending order (newest first)
    const sortedReviews = oldAgeHome.num_review.sort(
      (a, b) => b.timestamp - a.timestamp
    );

    res.status(200).json({
      num_review: sortedReviews,
      num_rating: oldAgeHome.num_rating,
      avg_rating: oldAgeHome.avg_rating,
    });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

const updateAppointmentSettings = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { opens_on, closes_on, working_days, is_appointment_enabled } =
      req.body;
    const oldAgeHome = await OldAgeHome.findById(homeId);

    if (!oldAgeHome) {
      return res.status(404).json({ message: "Old-age home not found" });
    }

    // Update appointment-related settings
    if (opens_on) oldAgeHome.opens_on = opens_on;
    if (closes_on) oldAgeHome.closes_on = closes_on;
    if (working_days) oldAgeHome.working_days = working_days;
    if (typeof is_appointment_enabled === "boolean")
      oldAgeHome.is_appointment_enabled = is_appointment_enabled;
    await oldAgeHome.save();
    res.json({
      message: "Appointment settings updated successfully",
      oldAgeHome,
    });
  } catch (error) {}
};
module.exports = {
  createOldAgeHome,
  getHomeReview,
  getAllOldAgeHomes,
  getManagerOldAgeHomes,
  updateRating,
};
