const router=require('express').Router()
const job_type_controler= require('../controler/Recruiter/JobTypeControler')
router.post('/',job_type_controler.create)
module.exports=router