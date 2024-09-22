const router=require('express').Router()
const userControler= require('../controler/userControler')
const {registerion,login,forgetpassword}= require('../ExpressValidator/user.js')
const validationResult= require('../ExpressValidator/Validator.js')




router.post('/signup',registerion,validationResult,userControler.Signup)
router.post('/login',login,validationResult, userControler.Login)
router.post('/forgetpassword',forgetpassword,validationResult, userControler.forgetpassword)
router.get('/resetpassword/:token', userControler.resetPassword)
router.post('/resetpassword/:userId', userControler.changePassword)
router.get('/logout',userControler.LogOut)
// router.put('/edit',verfiyUser, verfiyRole(ROLES_LIST.Admin,ROLES_LIST.Editor),userControler.Edit)
router.get('/get-cookie',userControler.getCookie)
router.get('/getRecentJob',userControler.getRecentJobs)

router.post('/verifyOtp',userControler.verifyOtp)
router.post('/ResendOtp',userControler.resendOtp)


module.exports=router