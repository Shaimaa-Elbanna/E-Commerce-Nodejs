import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createSubCategorySchema = joi.object({
    file: generalFields.file.required()

    ,

    name: generalFields.name.required(),

    categoryId :generalFields.id


}).required()



export const updateSubCategorySchema = joi.object({
    file: generalFields.file,

    name: generalFields.name,

    categoryId: generalFields.id,
    subCategoryId: generalFields.id


}).required()
export const deleteSubCategorySchema = joi.object({


    subCategoryId: generalFields.id


}).required()




