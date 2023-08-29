import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema({

    name: {
        type: String,
        require: true,
        unique: true,
         lowecase: true
    },
    slug: {
        type: String,
        require: true
    },
    image: { type: Object, required: true },

    customId: String,

    createdBy: { type: Types.ObjectId, ref: "User", require: true },
    updatedBy: { type: Types.ObjectId, ref: "User" }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },

        timestamps: true
    })

categorySchema.virtual('subcategoty', {
    localField: '_id',
    foreignField: 'categoryId',
    ref: 'SubCategory'
})

categorySchema.pre('save', function () {
    this.imag = `http://localhost:5000/${this.imag}`
})

const categoryModel = mongoose.models.Category || model("Category", categorySchema)

export default categoryModel