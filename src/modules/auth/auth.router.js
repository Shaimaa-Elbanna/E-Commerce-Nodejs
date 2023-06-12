import { Router } from "express";
import * as authController from './controller/auth.controller.js'
import { fileValidation } from "../../utilies/fileUpload.js";
import { signupSchema, loginSchema, sendCodeSchema, forgetPasswordSchema } from "./auth.validate.js";
import { isValid } from "../../middleware/validation.js";
import cloudFileUpload from "../../utilies/cloudinaryUploder.js";

const router = Router()


router.post('/signup',cloudFileUpload(fileValidation.img).single('userImage'),isValid(signupSchema), authController.signup)


router.get('/confirmEmail/:token',authController.confirmEmail)

router.get('/reConfirmEmail/:refToken',authController.reConfirmEmail)

router.post ('/login', isValid(loginSchema), authController.login)


// router.patch ('/sendLink', isValid(sendCodeSchema), authController.sendLink)
// router.get ('/confirmSendLink/:token',  authController.confirmSendLink)


router.patch ('/sendCode', isValid(sendCodeSchema), authController.sendCode)

router.post ('/forgetPassword', isValid(forgetPasswordSchema), authController.forgetPassword)









export default router