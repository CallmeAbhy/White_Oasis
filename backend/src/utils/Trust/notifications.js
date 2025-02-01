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
const sendHomePostInfo = async (
  email,
  manager_email,
  name_of_trust,
  username
) => {
  const templatePath = path.join(__dirname, "../templates", "homepost.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(/{{manager_username}}/g, username);
  htmlTemplate = htmlTemplate.replace(/{{old_age_home_name}}/g, name_of_trust);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    cc: manager_email,
    subject: "Our team has processed your registration",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
const sendHomeDeleteInfo = async (
  email,
  manager_email,
  name_of_trust,
  username
) => {
  const templatePath = path.join(__dirname, "../templates", "homedelete.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(/{{manager_username}}/g, username);
  htmlTemplate = htmlTemplate.replace(/{{old_age_home_name}}/g, name_of_trust);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    cc: manager_email,
    subject: "Old age home successfully deleted",
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = { sendHomePostInfo, sendHomeDeleteInfo };
