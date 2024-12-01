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
const sendConfirmation = async (email, organization_name, username) => {
  const templatePath = path.join(
    __dirname,
    "../templates",
    "confirmation.html"
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(/{{username}}/g, username);
  htmlTemplate = htmlTemplate.replace(
    /{{organization_name}}/g,
    organization_name
  );
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: obj.email,
    subject: "Our team has processed your registration",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
const sendRejection = async (email, organization_name, username, feedback) => {
  const templatePath = path.join(__dirname, "../templates", "reject.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(/{{username}}/g, username);
  htmlTemplate = htmlTemplate.replace(
    /{{organization_name}}/g,
    organization_name
  );
  htmlTemplate = htmlTemplate.replace(/{{feedback}}/g, feedback);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: obj.email,
    subject: "Our team has Rejected Your Registration Please view Feedback",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
const approval = async (email, organization_name, username, feedback) => {
  const templatePath = path.join(__dirname, "../templates", "approval.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace(/{{username}}/g, username);
  htmlTemplate = htmlTemplate.replace(
    /{{organization_name}}/g,
    organization_name
  );
  htmlTemplate = htmlTemplate.replace(/{{feedback}}/g, feedback);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: obj.email,
    subject: "Our team has Approved Your Registration",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = { sendConfirmation, sendRejection, approval };
