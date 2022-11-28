const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: "phpitladiplomado@gmail.com",
    pass: "otvjzwuabrxcrkwg",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;