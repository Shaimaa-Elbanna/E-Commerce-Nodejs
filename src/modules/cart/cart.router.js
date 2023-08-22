import { Router } from "express"

import * as cartController from './contrroller/cart.controller.js'
import * as validators from './cart.validation.js'
import { auth } from '../../middleware/auth.js';
import { endPoint } from './cart.endPoint.js';
const router =Router()


router.get ('/',auth(endPoint.create),cartController.getCart)
router.post ('/',auth(endPoint.create),cartController.createCart)

router.patch ('/remove',auth(endPoint.create),cartController.removeCart)

router.delete ('/clear',auth(endPoint.create),cartController.clearCart)




export default router