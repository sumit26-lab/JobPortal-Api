const router=require('express').Router()
const jobPost_controler= require('../../controler/Recruiter/JobsPostControler')
router.post('/',jobPost_controler.create)
router.get('/getJobId/:id',jobPost_controler.getJobById)
router.get('/:id',jobPost_controler.getAllJobpost)
router.get('/',jobPost_controler.getALLJobs)
router.delete('/:id',jobPost_controler.deleteJobPost)


module.exports=router