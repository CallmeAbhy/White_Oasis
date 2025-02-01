const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendAppointmentReq = async (
  email,
  home_email,
  manager_email,
  username,
  oldAgeHomename,
  appointment_type,
  reason,
  start_time,
  end_time,
  appointment_date
) => {
  const templatePath = path.join(
    __dirname,
    "../../templates",
    "appointmentrequest.html"
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(
    /{{appointment_type}}/g,
    appointment_type
  );
  htmlTemplate = htmlTemplate.replace(/{{reason}}/g, reason);
  htmlTemplate = htmlTemplate.replace(/{{username}}/g, username);
  htmlTemplate = htmlTemplate.replace(
    /{{appointment_date}}/g,
    appointment_date
  );
  htmlTemplate = htmlTemplate.replace(/{{start_time}}/g, start_time);
  htmlTemplate = htmlTemplate.replace(/{{end_time}}/g, end_time);
  htmlTemplate = htmlTemplate.replace(/{{address}}/g, address);
  htmlTemplate = htmlTemplate.replace(/{{city}}/g, city);
  htmlTemplate = htmlTemplate.replace(/{{state}}/g, state);
  htmlTemplate = htmlTemplate.replace(/{{country}}/g, country);
  htmlTemplate = htmlTemplate.replace(/{{oldAgeHomeName}}/g, oldAgeHomeName);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    cc: home_email,
    bcc: manager_email,
    subject: "Appointment Requested",
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};

const sendAppointmentConfirmation = async (
  email,
  home_email,
  manager_email,
  username,
  oldAgeHomename,
  appointment_type,
  reason,
  start_time,
  end_time,
  appointment_date
) => {
  const templatePath = path.join(
    __dirname,
    "../../templates",
    "appointmentaccept.html"
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(
    /{{appointment_type}}/g,
    appointment_type
  );
  htmlTemplate = htmlTemplate.replace(/{{reason}}/g, reason);
  htmlTemplate = htmlTemplate.replace(/{{username}}/g, username);
  htmlTemplate = htmlTemplate.replace(
    /{{appointment_date}}/g,
    appointment_date
  );
  htmlTemplate = htmlTemplate.replace(/{{start_time}}/g, start_time);
  htmlTemplate = htmlTemplate.replace(/{{end_time}}/g, end_time);
  htmlTemplate = htmlTemplate.replace(/{{address}}/g, address);
  htmlTemplate = htmlTemplate.replace(/{{city}}/g, city);
  htmlTemplate = htmlTemplate.replace(/{{state}}/g, state);
  htmlTemplate = htmlTemplate.replace(/{{country}}/g, country);
  htmlTemplate = htmlTemplate.replace(/{{oldAgeHomeName}}/g, oldAgeHomeName);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    cc: home_email,
    bcc: manager_email,
    subject: "Appointment Scheduled",
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};
const sendAppointmentRejection = async (
  email,
  home_email,
  manager_email,
  username,
  feedback
) => {
  const templatePath = path.join(
    __dirname,
    "../../templates",
    "appointmentreject.html"
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(/{{username}}/g, username);
  htmlTemplate = htmlTemplate.replace(/{{feedback}}/g, feedback);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    cc: home_email,
    bcc: manager_email,
    subject: "Appointment Rejected Please view Feedback",
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = {
  sendAppointmentReq,
  sendAppointmentConfirmation,
  sendAppointmentRejection,
};
