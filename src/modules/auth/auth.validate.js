import joi from "joi";
import { generalFields } from "../../middleware/validation.js";




export const signupSchema = joi.object({
    file: generalFields.file


    name: generalFields.name.required(),

    email: generalFields.email.required(),

    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.valid(joi.ref("password")),
    phone: joi.string().length(12).optional(),
    gender: joi.string().valid('male', 'female').optional(),


}).required()

export const loginSchema = joi.object({


    email: generalFields.email.required(),

    password: generalFields.password.required(),


}).required()


export const sendCodeSchema = joi.object({


    email: generalFields.email.required(),



}).required()



export const forgetPasswordSchema = joi.object({


    email: generalFields.email.required(),

    password: generalFields.password.required(),

    confirmPass: generalFields.confirmPassword.valid(joi.ref("password")),

    code: joi.string().pattern(new RegExp(/^[0-9]{5}$/)).required()


}).required()