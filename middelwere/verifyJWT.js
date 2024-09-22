let {verify}= require('jsonwebtoken')
require('dotenv').config()
const verfiyUser=(req,res,next)=>{

    let authHeder=req.headers.authorization ||req.headers.Authorization
    
    if(!authHeder?.startsWith('Bearer ')) return res.sendStatus(401)
        let token= authHeder.split(' ')[1]
    // console.log("verfiyToken",token)
        verify(token,process.env.ACCESS_SECRET_TOKEN,(err,decode)=>{
            
            if(err) return res.sendStatus(403)
                console.log("VerifyUser...>",decode)
                 //{return res.sendStatus(403)}
                req.username=decode.UserInfo.username,
                req.roles_id=decode.UserInfo.roles_id
                
              next()
        })
}
module.exports=verfiyUser
