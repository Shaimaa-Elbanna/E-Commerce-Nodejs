import mongoose, { Schema, Types, model } from "mongoose";


const brandSchema =new Schema({
    name:{type:String,require:true, unique:true,lowecase:true},
    image:{type:Object,required:true},
    createdBy:{type:Types.ObjectId,ref:'User',require:true},
    updatedBy:{type:Types.ObjectId,ref:'User'},
    categoryRelated:{type:Types.ObjectId,ref:'Category'},
})


const brandModel =mongoose.models.Brand|| model("Brand",brandSchema)


export default brandModel