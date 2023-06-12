import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createCategorySchema = joi.object({
    file: generalFields.file.required()

    ,

    name: generalFields.name.required(),


}).required()



export const updateCategorySchema = joi.object({
    file: generalFields.file,

    name: generalFields.name,

    categoryId: generalFields.id


}).required()
export const deleteCategorySchema = joi.object({


    categoryId: generalFields.id


}).required()




