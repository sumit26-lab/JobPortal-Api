const { body } = require('express-validator')
const bcrypt = require('bcrypt')
const pool = require('../util/db')
const {EmailSend}= require('../util/Email')
const { text } = require('body-parser')

let registerion = [
    body('username')
    .trim()
    .notEmpty().withMessage('Plase Enter User Name !')
    .custom(async (value, req) => {
        let userQuery = `select * from user_account where username=$1`
        let User = await pool.query(userQuery, [value])
        let founduser = await User.rowCount;
        if (founduser > 0) {
            throw new Error('User Name allready Exists..')
        }
        return true
    }),
    body('email').isEmail().withMessage('Invalid email format').custom(async (value, req) => {
        let userQuery = `select * from user_account where email=$1`
        let Email = await pool.query(userQuery, [value])
        let foundEmail = await Email.rowCount;
        if (foundEmail) {
            throw new Error('Email is allraedy Used try new')
        }

        return true

    }),
    body('password').isLength({ min: 5, max: 8 }).withMessage('password should be min 5 max 8')
]
let login = [
    body('identifyer')
    .trim()
    .notEmpty().withMessage('Identifier (username or email) is required.')
    .custom(async (value, {req}) => {
        let query = {
            text: `SELECT * FROM user_account
          WHERE username = $1 OR email = $1`,
            values: [value]

        }
        let { rows } = await pool.query(query)
        if (rows.length === 0) {
            
            throw new Error('Invalid username or email.');
        }
       
        
        req.user = rows[0]; // Set the user data on the request object
        return true
    })
    ,
    body('password')
    .trim()
    .notEmpty().withMessage('Password  is requrired !')
    .custom(async(value,{req})=>{
        let isMatch= await bcrypt.compare(value,req.user.password)

        if (!isMatch) {
          throw Error  ('Invalid  password' );
        }

        return true

    })
 
    
]

let forgetpassword=[
body('identifyer')
.trim()
.notEmpty()
.withMessage('Identifier (username or email) is required.')
.custom(async(val,{req})=>{
      let query = `SELECT * FROM user_account WHERE username = $1 OR email = $1`;
      let result = await pool.query(query, [val]);
      
      let data = result.rows[0];
      if (!data) {
        throw Error  ('username and email address does not exist.' );
      }
      req.user=data

      return true

}),


]
///api/v1/users/verify-otp

let ResendOtp=[
    body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async(value,{req})=>{
        let User_Account={
            text:'select username from user_account where email=$1',
            values:[value]
        }
           
        let user = (await pool.query(User_Account)).rows[0];
        if(!user){
            return Promise.reject("Email  is not Foound this otp")
        }
        req.username=user.username
        return true;
    })

        
        // Return true if validation passes
       
       
  
]
let verifyOtp=[

    body('email').isEmail().withMessage('Invalid email address'),
    body('otp').trim().notEmpty().withMessage('OTP is required'),

    body('oldpassword')
    .trim()
    .notEmpty().withMessage('Old password  is requrired !')
    .custom(async(value,{req})=>{
        const user = req.user; 
        let isMatch= await bcrypt.compare(value,user.password)

        if (!isMatch) {
          throw new  Error('Invalid old  password' );
        }

        return true

    }),
    body('newpassword')
    .trim()
    .notEmpty()
    .withMessage('new password is required !')
    .isLength({min:6})
    .withMessage('New password must be at least 6 characters long'),

    body('confrimpassword')
    .trim()
    .notEmpty()
    .withMessage('confrim password is requrired')
    .custom((value,{req})=>{
        if(value !=req.body.newpassword){
            throw new Error('New password and confirmation password do not match');
        }
        return true
    })
    
    
    
    ]
    
module.exports = { registerion,login,  forgetpassword,verifyOtp,ResendOtp }