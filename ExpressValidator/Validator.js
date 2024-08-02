const {validationResult}= require('express-validator')

module.exports=async(req,res,next)=>{

 let errors= await  validationResult(req)
 if(!errors.isEmpty()) {
    
    req.validationErrors = errors.array();
     next()
 }
 next()
}