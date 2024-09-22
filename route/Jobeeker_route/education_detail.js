const router=require('express').Router()
const education_detail= require('../../controler/Jobseeker/jobEductionControler')
router.post('/',education_detail.createEduction)
router.get('/',education_detail.getAlleducation_detail)
router.get('/:id',education_detail.getIdByEduction)
router.put('/:id',education_detail.update)
router.delete('/:id',education_detail.deleteEdution)
module.exports=router