const router=require('express').Router()
const job_type_controler= require('../../controler/Recruiter/JobTypeControler')
router.post('/',job_type_controler.create)
router.put('/:id',job_type_controler.upadte)
router.delete('/:id',job_type_controler.delete)
module.exports=router