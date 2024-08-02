const router=require('express').Router()
const {handlerRefreshToken}= require('../controler/RefreshTokenControler')

router.get('/',handlerRefreshToken)
module.exports=router