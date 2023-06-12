import mongoose, { Schema, Types, model } from "mongoose"


const userSchema = new Schema({

    name: { type: String, required: true },

    password: { type: String, required: true },

    customId:{ type: String },

    email: { type: String, required: true, unique: true },

    slug: { type: String, required: true },

    role: { type: String, default: 'User', enum: ['User', 'Admin', 'HR'] },

    phone: { type: String },

    image: { type: Object },

    status: { type: String, default: 'offline', enum: ['offline', 'online', 'blocked'] },

    DOB: { type: String },

    confirmEmail: { type: Boolean, default: false },

    gender: { type: String, default: 'female', enum: ['male', 'female'] },

    forgetPassCode: {
        type: String,
        default: null
    },
    forgetPassLink: {
        type: Boolean,
        default: false
    },
    changePassTime: {
        type: Date,
    },

    userWishList: {type:[Types.ObjectId],ref:"Product"},
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.pre('save', function () {
    this.img = `http://localhost:5000/${this.img}`
})

const userModel = mongoose.models.User || model('User', userSchema)

export default userModel