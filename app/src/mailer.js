const nodemailer = require("nodemailer");
const config = process.env;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: config.MAILUSER,
    pass: config.MAILPASS,
  },
});

module.exports = transporter;
