import mongoose, { Schema, Types, model } from "mongoose";


const productSchema = new Schema({

    customID:String,
    name: { type: String, require: true, trim: true },
    slug: { type: String, require: true, trim: true },
    discription :String,
    price: { type: Number, default: 1, require: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 1, require: true },
    stock: { type: Number, default: 1, require: true },
    size: { type: [String], enum: ['xs', 's', 'm', 'l', 'xl'] },
    colors:{type:[String]},



    mainImage: { type: Object, required: true },
    subImages: { type: [Object] },
    categoryId: { type: Types.ObjectId, ref: 'Category', require: true },
    brandId: { type: Types.ObjectId, ref: 'Brand', require: true },
    subCategoryId: { type: Types.ObjectId, ref: 'SubCategory', require: true },

    createdBy: { type: Types.ObjectId, ref: 'User', require: true },
    updatedBy: { type: Types.ObjectId, ref: 'User' },

    isDeleted:{type:Boolean ,default:false},

},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

productSchema.virtual("review",{
    ref:"Review",
    foreignField:"productId",
    localField:"_id"
})
productSchema.virtual("brand",{
    ref:"Brand",
    foreignField:"_id",
    localField:"brandId"
})


const productModel = mongoose.models.Productd || model("Productd", productSchema)


export default productModel