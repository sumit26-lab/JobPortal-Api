const router=require('express').Router()
const resume= require('../../controler/Jobseeker/jobresumeControler')
const {upload}= require('../../util/uploadfile')
router.post('/',upload.single('resume'),resume.create)
router.get('/',resume.getAll)
router.get('/:id',resume.getIdBy)
router.put('/:id',resume.update)
router.delete('/:id',resume.delete)
module.exports=router