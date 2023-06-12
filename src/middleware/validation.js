import joi from "joi"
import { AppError } from "../utilies/errorHandling.js"
import { Types } from "mongoose";



const validatObjectId = (value, helper) => {


    return Types.ObjectId.isValid(value) ? true : helper.message("In-Valid object ID")

}

export const generalFields = {

    file: joi.object({
        filename: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        path: joi.string().required(),
        destination: joi.string().required(),
        fieldname: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        // buffer: joi.binary().required(),
        dest: joi.string()
    })
    ,

    name: joi.string().min(2).max(15),
    password: joi.string().min(2).max(15),
    confirmPassword: joi.string().min(2).max(15),

    email: joi.string().email(),

    id: joi.string().hex().custom(validatObjectId).required(),
    optionalId: joi.string().hex().custom(validatObjectId),
    headers: joi.string().required()
}





export const isValid = (schema, considerHeaders = false) => {

    return (req, res, next) => {

        let inputData = { ...req.body, ...req.params, ...req.query }

        if (req.file || req.files) {

            inputData.file = req.file || req.files

        }
        if (req.headers && considerHeaders == true) {
            inputData = {authorization: req.headers.authorization }
        }


        const { error } = schema.validate(inputData, { abortEarly: false })


        if (error != null) {
            const messages = error.details.map(object => { return object.message })

            return res.status(400).json({ error: "validationError", messages: messages })
            // return next (new AppError(`{error:"validationError", messages: ${messages} }`,400))
        }
        else {
            return next()
        }

    }
}