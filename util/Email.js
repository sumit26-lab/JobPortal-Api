//Get your own Node.js Server
var nodemailer = require('nodemailer');
const crypto= require('crypto')
const path= require('path')
const fs=require('fs')
const ejs = require('ejs'); // Don't forget to import ejs
require('dotenv').config()
var transporter =  nodemailer.createTransport({
  service: process.env.GService,
  auth: {
    user: process.env.GUSER,
    pass: process.env.GPASS
  }
});

const getHtmlTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, '..', 'views', `${templateName}.ejs`); // Adjust path as necessary
  const template = fs.readFileSync(templatePath, 'utf-8'); // Read the template file
  return ejs.render(template, data); // Render the template with data
};
const sendEmail = (to, type, data) => {
  let subject;
  let templateName;

  // Set subject and template based on the type of email
  switch (type) {
      case 'otp':
          subject = 'Your OTP for Verification';
          templateName = 'otp-template'; // EJS template for OTP
          break;
      case 'Resend OTP':
          subject = 'Your Resend OTP Request';
          templateName = 'resend-otp-template'; // EJS template for verification
          break;
      case 'Reset-Password-link':
          subject = 'Your Password Reset Request';
          templateName = 'reset-password'; // EJS template for verification
          break;
      default:
          throw new Error('Invalid email type');
  }

  const mailOptions = {
      from: 'JobTageInfo@.com', // Sender address
      to: to, // Receiver email address
      subject: subject, // Subject line
      html: getHtmlTemplate(templateName, data) // Use the rendered EJS template
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log('Error occurred:', error);
      }
      console.log('Message sent:', info.messageId);
      return info.messageId
  });
};


const CreateResetToken= function(){
  const resetToken= crypto.randomBytes(32).toString('hex')
  const passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
  const passwordResetTokenExpire=Date.now()+10*60*1000
  return{resetToken,passwordResetToken,passwordResetTokenExpire}
}
module.exports={sendEmail,CreateResetToken}
