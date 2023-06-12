import { Router } from "express";
import * as subCategoryController from './controller/subCategory.controller.js'
import  { fileValidation } from "../../utilies/fileUpload.js";
import { createSubCategorySchema, deleteSubCategorySchema, updateSubCategorySchema } from "./subCategory.validation.js";
import { isValid } from "../../middleware/validation.js";
import cloudFileUpload from "../../utilies/cloudinaryUploder.js";
import { auth } from "../../middleware/auth.js";
import endPoint from "./subCategory.endPont.js";
const router = Router({mergeParams:true})

router.post('/',auth(endPoint.create), cloudFileUpload(fileValidation.img).single('image'),isValid(createSubCategorySchema), subCategoryController.createSubCategory)

router.put('/:subCategoryId',auth(endPoint.update),cloudFileUpload(fileValidation.img).single('image'), isValid(updateSubCategorySchema), subCategoryController.updateSubCategory)


router.delete('/:subCategoryId',auth(endPoint.delete), isValid(deleteSubCategorySchema), subCategoryController.deleteSubCategory)


router.get('/', auth(endPoint.get),subCategoryController.getAllSubCategory)





export default router