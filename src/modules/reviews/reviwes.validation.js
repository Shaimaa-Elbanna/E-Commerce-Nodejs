import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createReviewSchema = joi.object({
    productId:generalFields.id,
    rate:joi.number().max(5).min(1).required(),
    comment:joi.string()
})
export const updateReviewSchema = joi.object({
    productId:generalFields.id,
    reviewId:generalFields.id,
    rate:joi.number().max(5).min(1),
    comment:joi.string()
})