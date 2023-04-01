const nodemailer = require('nodemailer');
const mailjet = require('nodemailer-mailjet-transport');

const transporter = nodemailer.createTransport(
    mailjet({
      auth: {
        apiKey: 'e7f8c23f48355a1314e93ca2804f5de7',
        apiSecret: '43f71bd3093b073ce8796ff4515d5a37',
      }
    })
  );


module.exports = transporter;