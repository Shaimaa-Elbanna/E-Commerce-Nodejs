import mongoose, { Schema, Types, model } from "mongoose";


const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', require: true },
    updatedBy:{ type: Types.ObjectId, ref: 'User', require: true },
    adress: { type: String, required: true },
    phone: [{ type: String, required: true }],
    note: String,

    products: [{
        name:{ type: String, required: true },
        productId: { type: Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1, required: true },
        unitPrice:{type:Number , required:true,default:1},
        finalPrice:{type:Number , required:true,default:1},

    },

    ],
    subTotal:{type:Number , required:true,default:1},

    finalPrice:{type:Number , required:true,default:1},

    copounId: { type: Types.ObjectId, ref: "Copoun" },
    payment:{
        type:String,
        default:"cash",
        enum:['cash','card']
    },

    orderStatus:{
        type:String,
        default:"placed",
        enum:["placed","waitPayment","canceled","deliverd",'onWay','rejected']
    },

    reason:String

},
{
    timestamps:true
})


const orderModel = mongoose.models.Order || model("Order", orderSchema)


export default orderModel