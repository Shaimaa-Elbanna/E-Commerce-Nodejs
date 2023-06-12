import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const orderSchema=joi.object({

    adress:joi.string().max(250),
    phone:joi.array().items(joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required()).max(3).min(1).required(),
    copounName:joi.string(),
    payment:joi.string().valid("cash","card"),

    products:joi.array().items(joi.object({
        productId:generalFields.id,
        quantity:joi.number().positive().integer().min(1).required()
    })).min(1)
}).required()





export const cancelOrderSchema=joi.object({

    reason:joi.string().required(),
    orderId:generalFields.id


}).required()


export const orderStatusByAdminSchema=joi.object({

    orderId:generalFields.id,
    orderStatus:joi.string().valid("deliverd",'onWay','rejected')


}).required()