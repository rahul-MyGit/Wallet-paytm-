const { Router } = require("express");
const userRouter=require('./user')
const accountRouter=require('./account')
const ledgerRouter=require('./ledger')

const router = Router();

router.use('/user',userRouter)
router.use('/account',accountRouter)
router.use('/ledger',ledgerRouter)

module.exports=router; 