import mongoose, { Schema, Types, model } from "mongoose";

const reviewsSchema = new Schema({
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    orderId: { type: Types.ObjectId, ref: "Order", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    rate: { type: Number, min: 1, max: 5, require: true },
    comment: { type: String }




}, {
    timestamps: true,
})


const reviewsModel = mongoose.models.Review || model("Review", reviewsSchema)

export default reviewsModel