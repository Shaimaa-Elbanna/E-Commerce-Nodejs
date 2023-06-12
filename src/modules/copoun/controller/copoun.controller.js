import slugify from "slugify";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import copounModel from "../../../../DB/models/copoun.model.js";
import cloudinary from "../../../utilies/cloudinary.js";













export const createCopoun = asyncErrorHandler(async (req, res, next) => {
    
    const  name  = req.body.name.toLowerCase()

    
const copoun =await copounModel.findOne({ name })
if(copoun){return next(new AppError('duplication of cat Name ', 409))}
    // (!copoun && next(new AppError('duplication of cat Name ', 409)))

    if(req.file){
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLODINARY_FOLDER}/copoun/${name}` })

    
    req.body.copoun={ secure_url, public_id } 

    }
    req.body.createdBy=req.user._id
    req.body.expirDate = new Date(req.body.expirDate)
 
    const crateCopoun = await copounModel.create(req.body)
    // const saveCopoun = await subCatFile.save()

    res.status(201).json({ message: 'done', crateCopoun })


})


export const getAllCopoun = asyncErrorHandler(async (req, res, next) => {

    const copoun = await copounModel.find({

    })

    res.status(201).json({ message: 'done', copoun })


})


export const updateCopoun = asyncErrorHandler(async (req, res, next) => {
    const { copounId } = req.params
    const copoun = await copounModel.findOne({ _id: copounId })

    if (!copoun) next(new AppError('Sorry copoun is not exist', 400));

    if (req.body.name) {
        if (req.body.name.toLowerCase() == copoun.name) {
            return next(new AppError('Sorry you cant update copoun with the same Name', 400))
        }
        if (await copounModel.findOne({ name: req.body.name })) { return next(new AppError('duplicate copoun name', 409)) }


        copoun.name = req.body.name.toLowerCase()
    }
    if (req.body.amount) {
       

        copoun.amount = req.body.amount
    }
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLODINARY_FOLDER}/category/${categoryId}/${copoun.customId}` })

        if(copoun.logo){
            await cloudinary.uploader.destroy(copoun.imag.public_id)

        }

        copoun.imag = { public_id, secure_url }



    }
    if(req.body.expirDate){
        copoun.expirDate =req.body.expirDate
    }
    copoun.updatedBy=req.user._id

    await copoun.save()


    res.status(200).json({ message: 'done', copoun })


})




export const deleteCopoun = asyncErrorHandler(async (req, res, next) => {

    const copoun = await copounModel.findByIdAndDelete(req.params.copounId)
    if (!copoun) next(new AppError('Sorry copoun is not exist', 400))






    res.status(200).json({ message: 'done', copoun })


})


