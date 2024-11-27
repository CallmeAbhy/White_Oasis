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
const sendConfirmation = async (obj) => {
  console.log(obj);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: obj.email,
    subject: "Our team has processed your registration",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation ${obj.username}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #4CAF50;
            text-align: center;
        }
        p {
            font-size: 18px;
            color: #555555;
            line-height: 1.6;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #888888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to White Oasis!</h1>
        <p>Your tender seedling, nurtured and grown,<br>
        Awaits the lifeblood, to claim as its own.</p>
        <div class="footer">
            <p>Thank you for joining us!</p>
        </div>
        <pre>${obj}</pre>
    </div>
</body>
</html>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendConfirmation;
