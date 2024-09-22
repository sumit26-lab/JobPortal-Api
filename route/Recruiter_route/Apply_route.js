const router=require('express').Router()
const {getApplyJob,chnageStatus}= require('../../controler/Recruiter/ApplyJobControler')


// router.get('/Industry',getIndustry)
// router.post('/',create)
// router.get('/',getAllComapy)
router.get('/:id',getApplyJob)
router.put('/:id',chnageStatus)
// router.put('/:id',update)
// router.delete('/:id',deletedComapy)

module.exports=router

// module.