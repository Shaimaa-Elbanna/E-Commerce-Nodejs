import { Router } from "express";
import * as brandController from './contoller/brand.controller.js'
import  { fileValidation } from "../../utilies/fileUpload.js";
import { createBrandSchema, deleteBrandSchema, updateBrandSchema } from "./brand.validatin.js";
import { isValid } from "../../middleware/validation.js";
import cloudFileUpload from "../../utilies/cloudinaryUploder.js";
import { auth } from "../../middleware/auth.js";
import endPoint from "../brand/brand.endPoint.js";
const router = Router()

router.post('/',auth(endPoint.create),cloudFileUpload(fileValidation.img).single('image'),isValid(createBrandSchema), brandController.createBrand)


router.put('/:brandId',auth(endPoint.update),cloudFileUpload(fileValidation.img).single('image'), isValid(updateBrandSchema), brandController.updateBrand)


router.delete('/:brandId',auth(endPoint.delete), isValid(deleteBrandSchema), brandController.deleteBrand)


router.get('/', auth(endPoint.get),brandController.getAllBrand)





export default router