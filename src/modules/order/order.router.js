import { Router } from "express";
import express from "express";

import * as orderController from './controller/order.controller.js'
import * as orderValidation from './order.validation.js'
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./order.endPoint.js";
import { isValid } from "../../middleware/validation.js";
const router = Router()



router.post("/", auth(endPoint.create), isValid(orderValidation.orderSchema), orderController.createOrder)
router.patch("/:orderId", auth(endPoint.cancelOrder), isValid(orderValidation.cancelOrderSchema), orderController.cancelOrder)
router.patch("/:orderId/admin", auth(endPoint.orderStatusByAdmin), isValid(orderValidation.orderStatusByAdminSchema), orderController.orderStatusByAdmin)
router.post("/webhook", express.raw({ type: 'application/json' }, orderController.webhook))

export default router