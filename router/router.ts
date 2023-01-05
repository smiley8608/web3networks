

import express from 'express'
import * as transaction from '../controllers/account'
const router=express.Router()

router.post('/addtransaction',transaction.AddAccount)

export default router