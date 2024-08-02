const {body}= require('express-validator')
const bcrypt =require('bcrypt')
const pool =require('../util/db')

let registerion=[
    body('username').custom(async(value,req)=>{
        let userQuery=`select * from user_account where username=$1`
        let User= await pool.query(userQuery,[value])
        let founduser = await User.rowCount;
        if(founduser >0){
            throw new Error('Your Name allready Exists..')
        }
        return true
    }),
    body('email').isEmail().withMessage('Invalid email format').custom(async (value, req) => {
        let userQuery=`select * from user_account where email=$1`
        let Email= await pool.query(userQuery,[value])
        let foundEmail = await Email.rowCount;
        if (foundEmail) {
            throw new Error('Email is allraedy Used try new')
        }

        return true
    
    }),
    body('password').isLength({ min: 5, max: 8 }).withMessage('password should be min 5 max 8')
]
let profileCreate=[
    
]

module.exports ={registerion}