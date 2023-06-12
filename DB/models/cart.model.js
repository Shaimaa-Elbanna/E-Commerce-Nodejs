import mongoose, { Schema, Types, model } from "mongoose";


const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', require: true, unique: true },
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1, required: true }
    },

    ]
})


const cartModel = mongoose.models.Cart || model("Cart", cartSchema)


export default cartModel