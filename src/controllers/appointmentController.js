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
// Helper Function to get Time Slots
// const generateTimeSlots = (
//   opensOn,
//   closesOn,
//   bookedAppointments,
//   durationInMinutes
// ) => {
//   const slots = [];
//   const [openHour, openMin] = opensOn.split(":");
//   const [closeHour, closeMin] = closesOn.split(":");

//   let currentTime = new Date();
//   currentTime.setHours(openHour, openMin, 0);

//   const endTime = new Date();
//   endTime.setHours(closeHour, closeMin, 0);

//   while (currentTime < endTime) {
//     const timeSlot = currentTime.toLocaleTimeString("en-US", {
//       hour12: false,
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     const isBooked = bookedAppointments.some((apt) => {
//       const appointmentStart = new Date();
//       const appointmentEnd = new Date();
//       const [startHour, startMin] = apt.start_time.split(":");
//       const [endHour, endMin] = apt.end_time.split(":");

//       appointmentStart.setHours(startHour, startMin, 0);
//       appointmentEnd.setHours(endHour, endMin, 0);

//       const slotTime = new Date();
//       const [slotHour, slotMin] = timeSlot.split(":");
//       slotTime.setHours(slotHour, slotMin, 0);

//       return slotTime >= appointmentStart && slotTime < appointmentEnd;
//     });

//     if (!isBooked) {
//       slots.push(timeSlot);
//     }

//     currentTime.setMinutes(currentTime.getMinutes() + durationInMinutes);
//   }

//   return slots;
// };
const generateTimeSlots = (
  opensOn,
  closesOn,
  bookedAppointments,
  durationInMinutes
) => {
  const slots = [];

  const [openHour, openMin] = opensOn.split(":");

  const [closeHour, closeMin] = closesOn.split(":");

  let currentTime = new Date();

  currentTime.setHours(openHour, openMin, 0);

  const endTime = new Date();

  endTime.setHours(closeHour, closeMin, 0);

  while (currentTime < endTime) {
    const timeSlot = currentTime.toLocaleTimeString("en-US", {
      hour12: false,

      hour: "2-digit",

      minute: "2-digit",
    });

    const isBooked = bookedAppointments.some((apt) => {
      const appointmentStart = new Date();

      const appointmentEnd = new Date();

      const [startHour, startMin] = apt.start_time.split(":");

      const [endHour, endMin] = apt.end_time.split(":");

      appointmentStart.setHours(startHour, startMin, 0);

      appointmentEnd.setHours(endHour, endMin, 0);

      const slotStartTime = new Date(currentTime);

      const slotEndTime = new Date(currentTime);

      slotEndTime.setMinutes(slotEndTime.getMinutes() + durationInMinutes);

      // Check if the slot overlaps with the booked appointment

      return slotStartTime < appointmentEnd && slotEndTime > appointmentStart;
    });

    if (!isBooked) {
      slots.push(timeSlot);
    }

    currentTime.setMinutes(currentTime.getMinutes() + durationInMinutes);
  }

  return slots;
};

// Update The Appointment Status Only For Managers
const updatetheAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, feedback } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not Found" });
    }
    // verify manager belongs to requested old age home
    const oldagehome = await OldAgeHome.findById(appointment.old_age_home_id);
    console.log(oldagehome.manager_id._id);
    if (oldagehome.manager_id._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const dailyAppointments = await Appointment.countDocuments({
      old_age_home_id: appointment.old_age_home_id,
      appointment_date: appointment.appointment_date,
      status: "Approved",
    });
    // Check Whether Daily Appointments are bypassed or not
    if (
      dailyAppointments >=
      oldagehome.appointment_settings.max_appointments_per_day
    ) {
      return res
        .status(400)
        .json({ message: "Maximum appointments for this day reached" });
    }
    appointment.status = status;
    if (status === "Rejected" && !feedback) {
      return res
        .status(401)
        .json({ message: "Feedback Required for Rejection" });
    } else if (status === "Approved") {
      appointment.feedback = "Looking forward to your appointment";
    } else {
      appointment.feedback = feedback;
    }
    await appointment.save();
    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { oldAgeHomeId, date } = req.params;
    const oldagehome = await OldAgeHome.findById(oldAgeHomeId);
    if (!oldagehome) {
      return res.status(404).json({ message: "Old age home not found" });
    }
    const existingAppointments = await Appointment.find({
      old_age_home_id: oldAgeHomeId,
      appointment_date: date,
      status: { $in: ["Approved", "Pending"] },
    });
    console.log(oldagehome.appointment_settings.duration);
    const availableSlots = generateTimeSlots(
      oldagehome.opens_on,
      oldagehome.closes_on,
      existingAppointments,
      oldagehome.appointment_settings.duration
    );

    res.status(200).json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

//functionality for managers to access all pending appointments
const getAppointments = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { status } = req.params;
    const oldagehome = await OldAgeHome.findOne({
      manager_id: managerId,
    });
    if (!oldagehome) {
      return res
        .status(404)
        .json({ message: "Old age home not found for this manager" });
    }
    // Get all pending appointments for this old age home
    const pendingAppointments = await Appointment.find({
      old_age_home_id: oldagehome._id,
      status: status,
    }).sort({ appointment_date: 1, start_time: 1 }); // Sort by date and time
    res.status(200).json({
      success: true,
      count: pendingAppointments.length,
      appointments: pendingAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong: ${error.message}`,
    });
  }
};
const getuserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.params;
    const requestedAppointments = await Appointment.find({
      user_id: userId,
      status: status,
    }).sort({ appointment_date: 1, start_time: 1 });

    res.status(200).json({
      success: true,
      count: requestedAppointments.length,
      appointments: requestedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong: ${error.message}`,
    });
  }
};
const getusernotificationcount = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const requestedAppointments = await Appointment.find({
      user_id: userId,
      status: { $in: ["Approved", "Rejected"] },
    }).sort({ appointment_date: 1, start_time: 1 });
    console.log(requestedAppointments);
    res.status(200).json({
      success: true,
      count: requestedAppointments.length,
    });
  } catch (error) {
    res.status(500).json({
      message: `Something wen Wrong: ${error.message}`,
    });
  }
};
module.exports = {
  createAppointment,
  updatetheAppointment,
  getAvailableSlots,
  getAppointments,
  getuserAppointments,
  getusernotificationcount,
};
