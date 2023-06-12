import { Router } from "express";
import * as categoryController from './controller/category.controller.js'
import { fileValidation } from "../../utilies/fileUpload.js";
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "./category.validate.js";
import { isValid } from "../../middleware/validation.js";
import subcategoryRouter from '../subcategoty/subCategory.router.js'
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./category.endPoint.js";
import cloudFileUpload from "../../utilies/cloudinaryUploder.js";

const router = Router()

router.use('/:categoryId/subcategory',subcategoryRouter)

router.post('/',auth(endPoint.create), cloudFileUpload(fileValidation.img).single('image'),isValid(createCategorySchema), categoryController.createCategory)

router.put('/:categoryId',auth(endPoint.update) ,cloudFileUpload(fileValidation.img).single('image'), isValid(updateCategorySchema), categoryController.updateCategory)


router.delete('/:categoryId',auth(endPoint.delete), isValid(deleteCategorySchema), categoryController.deleteCategory)


router.get('/', auth(endPoint.get),categoryController.getAllCategory)





export default router