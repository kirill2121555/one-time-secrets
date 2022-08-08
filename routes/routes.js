const Router=require('express')
const router=new Router()
const controller=require('../controller/controller')

router.post('/generate', controller.generate)
router.get('/secrets/:secret_key', controller.secrets)

module.exports=router