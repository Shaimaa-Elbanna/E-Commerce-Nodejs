import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createCopounSchema = joi.object({
    file: generalFields.file

    ,

    name: generalFields.name.required(),

amount:joi.number().positive().min(1).max(100).required(),

expirDate:joi.date().greater(Date.now()).required()

}).required()



export const updateCopounSchema = joi.object({
    file: generalFields.file,

    name: generalFields.name,

    copounId: generalFields.id.required(),

    amount:joi.number().positive().min(1).max(100),
    expirDate:joi.date().greater(Date.now()),


}).required()
export const deleteCopounSchema = joi.object({


    CopounId: generalFields.id


}).required()




