const router=require('express').Router()
const {getIndustry,create,getAllComapy,getIdComapy,update,deletedComapy}= require('../../controler/Recruiter/CompanyControler')


router.get('/Industry',getIndustry)
router.post('/',create)
router.get('/',getAllComapy)
router.get('/:id',getIdComapy)
router.put('/:id',update)
router.delete('/:id',deletedComapy)



module.exports=router