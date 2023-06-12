import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import cloudinary from "../../../utilies/cloudinary.js";
import brandModel from "../../../../DB/models/brand.model.js";
import slugify from "slugify";













export const createBrand = asyncErrorHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase()


    const brand = await brandModel.findOne({  name })

    if (brand) { return next(new AppError('duplication of cat Name ', 409)) }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLODINARY_FOLDER}/brand/${slugify(name)}` })



    const subCatFile = await brandModel.create({
        name,
        image: { secure_url, public_id },
        createdBy: req.user._id

    })
    // const brand = await subCatFile.save()

    res.status(201).json({ message: 'done', subCatFile })


})


export const getAllBrand = asyncErrorHandler(async (req, res, next) => {

    const brand = await brandModel.find({

    })

    res.status(201).json({ message: 'done', brand })


})


export const updateBrand = asyncErrorHandler(async (req, res, next) => {
    const { brandId } = req.params
    const brand = await brandModel.findOne({ _id: brandId })

    if (!brand) next(new AppError('Sorry brand is not exist', 400));

    if (req.body.name) {
        if (req.body.name.toLowerCase() == brand.name) {
            return next(new AppError('Sorry you cant update brand with the same Name', 400))
        }
        if (await brandModel.findOne({ name: req.body.name })) { return next(new AppError('duplicate brand name', 409)) }


        brand.name = req.body.name
    }
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLODINARY_FOLDER}/brand/${slugify(brand.name)}` })

        await cloudinary.uploader.destroy(brand.imag.public_id)

        brand.imag = { public_id, secure_url }



    }

    brand.updatedBy = req.user._id

    await brand.save()


    res.status(200).json({ message: 'done', brand })


})




export const deleteBrand = asyncErrorHandler(async (req, res, next) => {

    const brand = await brandModel.findByIdAndDelete(req.params.brandId)
    if (!brand) next(new AppError('Sorry brand is not exist', 400))






    res.status(200).json({ message: 'done', brand })


})


