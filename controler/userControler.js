const bycrpt = require('bcrypt')
const pool = require('../util/db')
const EmailSend = require('../util/Email')
const jwt= require('jsonwebtoken')
//. Managing Users

require('dotenv').config()

exports.Signup = async (req, res) => {
  let { username, password, email, user_type, gender, contactphone } = req.body


  if (req.validationErrors) {
    return res.status(400).json({ errors: req.validationErrors });
  }
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    let Hspassword = await bycrpt.hash(password, 10)
    let query = 'insert into  user_account (username,password,email,user_type_id,gender,contactphone)values($1,$2,$3,$4,$5,$6) returning  user_account_id'
    let insertData = await pool.query(query, [username, Hspassword, email, user_type, gender, contactphone])
    let emailSender = await EmailSend({ to: email, subject: "OTP-verification", text: `Your Otp is ${otp}` })
    let queryOtp = 'insert into otp(otp_code,expiry_time,user_email)values($1,$2,$3)'
    let expiry_time = new Date()
    expiry_time.setMinutes(expiry_time.getMinutes() + 20)
    let data = await insertData.rows[0]
    console.log(data)
    await pool.query(queryOtp, [otp, expiry_time, email])
    res.status(200).send({ user_account_id: data.user_account_id, message: "verifationis panding check You Email" })

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user', error);
  }
  res.send('ok')
}

exports.resendOtp = async (req, res) => {

  const otp = Math.floor(1000 + Math.random() * 9000);
  let expiry_time = new Date()
  expiry_time.setMinutes(expiry_time.getMinutes() + 20)
  let { email } = req.body
  try {
    if (!email) {
      return new Error("email is not provide")
    }
    let emailSender = await EmailSend({ to: email, subject: "OTP-verification", text: `Your Otp is ${otp}` })
    let queryOtp = {
      text: `INSERT INTO otp(otp_code,expiry_time,user_email)
      values($1,$2,$3)
      ON CONFLICT (user_email) DO UPDATE
      SET otp_code=$1,expiry_time=$2 `,
      values: [otp, expiry_time, email]
    }

    let { rows } = await pool.query(queryOtp)
    if (!rows) {
      return res.status(500).json("server Error");
    }
    else {
      res.status(200).send("ok")
    }
  }
  catch (err) {
    res.status(500).send(err);
  }


}
exports.verifyOtp = async (req, res) => {
  let otp = req.body.otp
  let email = req.body.email

  try {

    let queryOtp = 'select otp_code ,expiry_time  from otp where user_email=$1 and otp_code=$2'

    let data = await pool.query(queryOtp, [email, otp])
    let result = await data.rows[0]
    if (!result) {
      throw new Error('Invalid Otp :')
    }
    if (result.expiry_time < new Date()) {
      throw new Error('OTP has expired');

    }
    let queryverifyOtp = 'update  user_account set is_active=true where email =$1'
    let is_active = await pool.query(queryverifyOtp, [email])
    let Querdeleteverfy = 'delete from otp where user_email=$1'
    let deletdVerfy = await pool.query(Querdeleteverfy, [email])
    res.send("User verfiy")
  } catch (error) {
    console.log(error.message)
    res.status(400).send({ error: error.message })
  }

}

exports.Login = async (req, res) => {
  let { identifyer, password } = req.body

  let query ={
    text:`SELECT * FROM user_account
  WHERE username = $1 OR email = $1`,
  values:[identifyer]
  }
  let {rows}= await pool.query(query)
  if (rows.length === 0) {
    return res.send("User Not Found! ") // User not found
  }
  let {password:Hspassword,user_account_id,user_type_id,username,role_id}= rows[0]
  

 
   let match= await bycrpt.compare(password,Hspassword)
 
   if(!match){
    return res.send("Password dose not match! ")
   }
   let accessToken= jwt.sign({ "UserInfo":{username,user_account_id,user_type_id,role_id}},process.env.Access_Screat_token,{expiresIn:'25s'})
   let refreshToken=jwt.sign({"username":{
    username,user_account_id
   }},process.env.Refresh_Scret_token,{expiresIn:'1d'})
  if(refreshToken){
    let queryuser_log={
      text :`insert into user_log(user_account_id,refresh_token)
      values($1,$2) 
    ON CONFLICT(user_account_id)
     DO UPDATE SET refresh_token=$2,las_login_date= CURRENT_TIMESTAMP  returning*`,values:[user_account_id,refreshToken]
  }
  let {rows}= await pool.query(queryuser_log)
  if (rows.length === 0) {
    return res.send("User Not Found! ") // User not found
  }
   
  }
  res.cookie('jwt',refreshToken,{httpOnly:true,maxAge:24*60*60*1000})
   res.send({accessToken})
   
}

exports.LogOut=async(req,res)=>{
  console.log("Logout API Callll--------->",req.cookies)
  let  cookies= req.cookies
    //console.log('api',cookies)
if(!cookies?.jwt) return res.status(401)
    console.log("cookie",cookies.jwt)
let refreshToken=cookies.jwt
console.log("ref",cookies)
  
    let query ={
      text:`SELECT * FROM user_log
    WHERE refresh_token = $1`,
    values:[refreshToken]
    }
    let data= await pool.query(query)
    let rows =await data.rows
    console.log("InsideDatabaseRefreshToken",rows)
    if (rows&&rows.length === 0) {
      res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
      return res.sendStatus(204)
    }
    
    let queryDelete ={
      text:`DELETE  FROM user_log
    WHERE refresh_token = $1`,
    values:[refreshToken]
    }
    let user_log= await pool.query(queryDelete)
 let user_logdata= await user_log.rowCount
 console.log("deleted Row",user_logdata)
if(user_logdata==1){
    console.log("inside user")
      res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
      return res.send("ok")
  
}

}
exports.getCookie=async (req, res) => {
  try{

    const cookieValue = req.cookies.jwt;
    res.send(cookieValue);
  }
  catch(err){
    res.sendStatus(404)
  }
 
}
exports.Edit=async(req,res)=>{
  console.log("edit")
  res.sendStatus(201)
}
