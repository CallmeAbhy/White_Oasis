const { User } = require("../models/userModel");
const OldAgeHome = require("../models/oldAgeHomeModel");
const Appointment = require("../models/appointmentModel");
// Create appointment (for users)
const createAppointment = async (req, res) => {
  try {
    const {
      old_age_home_id,
      appointment_type,
      reason,
      start_time,
      end_time,
      appointment_date,
    } = req.body;
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    console.log(old_age_home_id);
    let oldAgeHome = await OldAgeHome.findById(old_age_home_id);
    if (!oldAgeHome) {
      return res.status(404).json({ message: "Old age home not found!" });
    }
    const dayIndex = new Date(appointment_date).getDay();
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const appointmentDay = daysOfWeek[dayIndex];
    if (!oldAgeHome.working_days.includes(appointmentDay)) {
      return res
        .status(400)
        .json({ message: "Old age home is closed on the selected day!" });
    }
    // Calculate duration in minutes
    const startMinutes = timeToMinutes(start_time);
    const endMinutes = timeToMinutes(end_time);
    const appointment_duration = endMinutes - startMinutes;
    const { duration } = oldAgeHome.appointment_settings;
    if (duration <= 0 || appointment_duration % duration !== 0) {
      return res.status(400).json({
        message: `Appointment duration must be a positive multiple of ${appointment_duration} minutes`,
      });
    }
    // Validate working hours
    if (start_time < oldAgeHome.opens_on || end_time > oldAgeHome.closes_on) {
      return res
        .status(400)
        .json({ message: "Appointment time is outside working hours" });
    }

    // Check slot availability
    const existingAppointments = await Appointment.find({
      old_age_home_id,
      appointment_date,
      status: { $in: ["Approved", "Pending"] },
      $or: [
        {
          start_time: { $lt: end_time },
          end_time: { $gt: start_time },
        },
      ],
    });
    if (existingAppointments.length > 0) {
      return res
        .status(400)
        .json({ message: "Selected time slot is not available" });
    }

    // Check max appointments per day
    const dailyAppointments = await Appointment.countDocuments({
      old_age_home_id,
      appointment_date,
      status: "Approved",
    });
    if (
      dailyAppointments >=
      oldAgeHome.appointment_settings.max_appointments_per_day
    ) {
      return res
        .status(400)
        .json({ message: "Maximum appointments for this day reached" });
    }
    const appointment = new Appointment({
      old_age_home_id,
      user_id: userId,
      appointment_type,
      reason,
      start_time,
      end_time,
      appointment_date,
      user_profile: user,
    });
    await appointment.save();
    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};
// Helper function to convert time to minutes
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

module.exports = {
  createAppointment,
};
