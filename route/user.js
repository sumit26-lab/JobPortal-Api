const router=require('express').Router()
const userControler= require('../controler/userControler')
const {registerion}= require('../ExpressValidator/user.js')
const validationResult= require('../ExpressValidator/Validator.js')
const pool= require('../util/db.js')
const ROLES_LIST= require('../config/ROLES_LIST.js')
const {verfiyRole}= require('../middelwere/verifyRole.js')
const verfiyUser= require('../middelwere/verifyJWT.js')
console.log(ROLES_LIST)

router.post('/',userControler.Signup)
router.post('/login',userControler.Login)
router.get('/logout',userControler.LogOut)
router.put('/edit',verfiyUser, verfiyRole(ROLES_LIST.Admin,ROLES_LIST.Editor),userControler.Edit)
router.get('/get-cookie',userControler.getCookie)

router.post('/verifyOtp',userControler.verifyOtp)
router.post('/ResendOtp',userControler.resendOtp)


module.exports=router