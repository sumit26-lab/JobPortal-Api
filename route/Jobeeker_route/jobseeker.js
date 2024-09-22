const router=require('express').Router()
const jobseekerControler= require('../../controler/Jobseeker/jobseekerControler')

router.get('/:id',jobseekerControler.getProfileByid)
router.post('/',jobseekerControler.SeekProfileCreated)
module.exports=router

