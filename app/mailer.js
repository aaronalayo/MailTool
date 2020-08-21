const nodemailer = require('nodemailer');
const config = require('./config.js');



const transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: true,
  auth: {
    user: config.mailUser,
    pass: config.mailPass
  }
});


module.exports = transporter;