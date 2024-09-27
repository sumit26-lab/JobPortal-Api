const router=require('express').Router()
const experience= require('../../controler/Jobseeker/jobexperience_detailControler')
router.post('/',experience.create)
router.get('/',experience.getAll)
router.get('/:id',experience.getIdBy)
router.put('/:id',experience.update)
router.delete('/:id',experience.delete)
module.exports=router