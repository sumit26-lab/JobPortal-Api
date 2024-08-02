const router=require('express').Router()
const jobseekerControler= require('../controler/jobseekerControler')

router.get('/:id',jobseekerControler.getProfileByid)
router.post('/createProfile',jobseekerControler.SeekProfileCreated)
module.exports=router

