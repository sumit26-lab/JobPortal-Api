//Get your own Node.js Server
var nodemailer = require('nodemailer');
const crypto= require('crypto')

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

const CreateResetToken= function(){
  const resetToken= crypto.randomBytes(32).toString('hex')
  const passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
  const passwordResetTokenExpire=Date.now()+10*60*1000
  return{resetToken,passwordResetToken,passwordResetTokenExpire}
}
module.exports={EmailSend,CreateResetToken}
