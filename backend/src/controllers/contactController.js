const { sendContactEmail } = require("../utils/notifications");

const sendContactMessage = async (req, res) => {
  try {
    const { fromEmail, toEmail, subject, message } = req.body;
    console.log("fromEmail ", fromEmail, "to Email ", toEmail);
    // Validate inputs
    if (!fromEmail || !toEmail || !subject || !message) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    await sendContactEmail(fromEmail, toEmail, subject, message);

    res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = {
  sendContactMessage,
};
