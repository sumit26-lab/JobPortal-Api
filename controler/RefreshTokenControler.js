let jwt= require('jsonwebtoken')
const pool= require('../util/db')
require('dotenv').config()
const handlerRefreshToken = async (req, res) => {
    let  cookies= req.cookies
    console.log('Request-cooike......>',cookies)
if(!cookies?.jwt) return res.sendStatus(401)
    console.log("Check-Cookie",cookies.jwt)
let refreshToken=cookies.jwt
  
  
    let query ={
      text:`SELECT * FROM user_log
    WHERE refresh_token = $1`,
    values:[refreshToken]
    }
    let data= await pool.query(query)
    let rows =await data.rows[0] 
    if (rows&&rows.length === 0) {
        return res.send("User Not Found! ") // User not found
    }

    
   //verify store cookie token to data base token
    jwt.verify(refreshToken,process.env.REFRESH_SECRET_TOKEN,(error,decode)=>{
        
        console.log("Refresh_Token-Generated..............>",decode)
        if(error||rows.user_account_Id!==decode.user_account_Id) return res.sendStatus(403)
            const accessToken=jwt.sign({
        "UserInfo":{
          "username": decode.UserInfo.username,
          "roles_id": decode.UserInfo.user_type_id,
          user_account_id:decode.UserInfo.user_account_id
        }
        },
    process.env.ACCESS_SECRET_TOKEN,{expiresIn:'1d'})
    res.json({ accessToken})
     })
  
   
     
  }
  
  module.exports={handlerRefreshToken }