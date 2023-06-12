import mongoose, { Schema, Types, model } from "mongoose";


const copounSchema = new Schema({
    name: { type: String, require: true,lowercase:true },
    logo: {},
    expirDate:{type:Date,required:true},

    createdBy:{type:Types.ObjectId,ref:'User',require:true},
    updatedBy:{type:Types.ObjectId,ref:'User'},
        amount: { type: Number ,default:1},
    usedBy: [{ type: Types.ObjectId, ref: 'User', require: true }],
})


const copounModel = mongoose.models.Copoun || model("Copoun", copounSchema)


export default copounModel