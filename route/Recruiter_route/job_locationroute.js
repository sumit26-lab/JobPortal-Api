const router=require('express').Router()
const loaction_controler= require('../../controler/Recruiter/job_locationControler')
router.post('/',loaction_controler.create)
router.get('/',loaction_controler.getAll_location)
router.get('/:id',loaction_controler.getIdloaction)
router.put('/:id',loaction_controler.update)
router.delete('/:id',loaction_controler.deletelocation)
module.exports=router