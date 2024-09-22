// const {validationResult}= require('express-validator')

// module.exports=async(req,res,next)=>{

//  let errors= await  validationResult(req)
//  if(!errors.isEmpty()) {
    
//     req.validationErrors = errors.array();
//      next()
//  }
//  next()
// }
const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    console.log("VALIDATION",req.user)
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
       errors= errors.array().map((err)=>err.msg)
       console.log(errors)
        return res.status(400).json({ errors  });
    }
    next();
};
