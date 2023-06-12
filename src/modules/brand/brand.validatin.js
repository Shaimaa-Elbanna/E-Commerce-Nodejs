import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createBrandSchema = joi.object({
    file: generalFields.file.required()

    ,

    name: generalFields.name.required(),



}).required()



export const updateBrandSchema = joi.object({
    file: generalFields.file,

    name: generalFields.name,

    brandId: generalFields.id.required(),

 


}).required()
export const deleteBrandSchema = joi.object({


    CopounId: generalFields.id


}).required()




