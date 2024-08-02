//Get your own Node.js Server
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sr26rajput@gmail.com',
    pass: 'rbkc krkk rzpo dyxk'
  }
});
const EmailSend=({to,subject,text})=>{
 text=text.toString()

 return new Promise((resolve,reject)=>{

  var mailOptions = {
    from: 'youremail@gmail.com',
    to: to,
    subject: subject,
    text: text
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      throw reject(error)
    } else {
      resolve( info.response)
    }
  });
 })
}
module.exports=EmailSend
