const router=require('express').Router()
const business_stream= require('../../controler/Recruiter/StreamControler')
// router.post('/',business_stream.create)
router.get('/',business_stream.getAllStream)
router.get('/:id',business_stream.getStreamById)
router.put('/:id',business_stream.update)
router.delete('/:id',business_stream.delete)
module.exports=router