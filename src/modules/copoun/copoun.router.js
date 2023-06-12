import { Router } from "express";
import {auth, roles} from '../../middleware/auth.js'
import * as copounController from './controller/copoun.controller.js'
import  { fileValidation } from "../../utilies/fileUpload.js";
import { createCopounSchema, deleteCopounSchema, updateCopounSchema } from "./copoun.validation.js";
import { isValid } from "../../middleware/validation.js";
import cloudFileUpload from "../../utilies/cloudinaryUploder.js";
import endPoint from "./copoun.endPoint.js";
const router = Router()

router.post('/',auth(endPoint.create),cloudFileUpload(fileValidation.img).single('image'),isValid(createCopounSchema), copounController.createCopoun)


router.put('/:copounId',auth(endPoint.update),cloudFileUpload(fileValidation.img).single('image'), isValid(updateCopounSchema), copounController.updateCopoun)

router.delete('/:copounId',auth(endPoint.delete), isValid(deleteCopounSchema), copounController.deleteCopoun)


router.get('/',auth(endPoint.get), copounController.getAllCopoun)





export default router