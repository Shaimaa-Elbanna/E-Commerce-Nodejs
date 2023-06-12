import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const header =joi.object(
    {
        authorization:generalFields.headers
    }
).required()

export const createProductSchema = joi.object({
    name: joi.string().max(120).min(5).required(),
    discription: joi.string().max(120000).min(5),
    price: joi.number().positive().min(1).required(),
    stock: joi.number().integer().positive().min(1).required(),
    discount: joi.number().positive().min(1).required(),
    colors: joi.array(),
    size: joi.array(),
    
    


    categoryId: generalFields.id.required(),
    brandId: generalFields.id.required(),
    subCategoryId: generalFields.id.required(),

    file: joi.object({

        mainImage: joi.array().items(generalFields.file.required()).length(1).required(),
        subImages: joi.array().items(generalFields.file).min(1).max(5)
    })




})

export const updateProductSchema = joi.object({
    name: joi.string().max(120).min(5),
    discription: joi.string().max(120000).min(5),
    price: joi.number().positive().min(1),
    stock: joi.number().integer().positive().min(1),
    discount: joi.number().positive().min(1),
    colors: joi.array(),
    size: joi.array(),
    
    


    categoryId: generalFields.optionalId,
    brandId: generalFields.optionalId,
    subCategoryId: generalFields.optionalId,

    productId:generalFields.id.required(),
    
    file: joi.object({

        mainImage: joi.array().items(generalFields.file.required()).length(1).required(),
        subImages: joi.array().items(generalFields.file).min(1).max(5)
    })

    // file: {
    //     mainImage: joi.array().items(joi.object({
    //       file: generalFields.file.required()
    //     })).required(),
    //     subImages: joi.array().items(joi.object({
    //       file: generalFields.file.required()
    //     })).min(1).max(5).required()
    //   }
    


})



export const addToUserWishlistSchema= joi.object({
    productId:generalFields.id
})
export const removeFromUserWishlistSchema= joi.object({
    productId:generalFields.id
})