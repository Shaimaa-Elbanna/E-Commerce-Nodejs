import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema =new Schema({

   name: {
    type:String,
    unique: true,
    require:true
   },
   customId: {
    type:String,
    require:true
   },
   slug: {
    type:String,
    require:true
   },
   imag: {
    type:Object,
    require:true
   },

   createdBy:{type:Types.ObjectId,ref:'User',require:true,lowecase:true},
   updatedBy:{type:Types.ObjectId,ref:'User'},
      categoryId:{type:Types.ObjectId , ref:"Category" },
},
    {
    timestamps:true
}) 

const subCategoryModel = mongoose.models.SubCategory|| model("SubCategory",subCategorySchema)

export default subCategoryModel