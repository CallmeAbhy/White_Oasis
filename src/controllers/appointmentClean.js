const cron = require("node-cron");
const Appointment = require("../models/appointmentModel");

// Add this function to clean up expired appointments
const cleanupExpiredAppointments = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Appointment.deleteMany({
      appointment_date: { $lt: today },
    });

    console.log(`Cleaned up ${result.deletedCount} expired appointments`);
  } catch (error) {
    console.error("Error cleaning up appointments:", error);
  }
};

// Schedule the cleanup to run every day at midnight
cron.schedule("0 0 * * *", () => {
  cleanupExpiredAppointments();
});
module.exports = {
  cleanupExpiredAppointments,
};
