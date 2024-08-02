const router=require('express').Router()
const loaction_controler= require('../controler/Recruiter/JobLoctaionControler')
router.post('/',loaction_controler.create)
router.get('/',loaction_controler.getAll_location)
router.get('/:id',loaction_controler.getAll_location)
router.put('/:id',loaction_controler.update)
module.exports=router