import slugify from "slugify";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import categoryModel from "../../../../DB/models/category.model.js";
import subCategoryModel from "../../../../DB/models/subCategory.model .js";
import { nanoid } from "nanoid";
import cloudinary from "../../../utilies/cloudinary.js";













export const createSubCategory = asyncErrorHandler(async (req, res, next) => {
    const { categoryId } = req.params
    const  name = req.body.name.toLowerCase()
    if (!req.file) { return next(new AppError("file is required")) }

    const checkCategory = await categoryModel.findById(categoryId)
    if (!checkCategory) { (new AppError('category is not founded')) }


    (await subCategoryModel.findOne({ name }) && next(new AppError('duplication of cat Name ', 409)))
    const customId = nanoid()
    const {  public_id,secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLODINARY_FOLDER}/category/${categoryId}/subCat/${customId}` })
    const subCatFile = new subCategoryModel({
        name,
        slug: slugify(name),
        imag: {  public_id,secure_url },
        customId,
        categoryId,
        createdBy:req.user._id
    })
    const SubCategory = await subCatFile.save()

    res.status(201).json({ message: 'done', SubCategory })


})


export const getAllSubCategory = asyncErrorHandler(async (req, res, next) => {

    const subCategory = await subCategoryModel.find({

    }).populate([{
        path:'categoryId',
      
    }])

    res.status(201).json({ message: 'done', subCategory })


})


export const updateSubCategory = asyncErrorHandler(async (req, res, next) => {
    const { subCategoryId, categoryId } = req.params
    const subCategory = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })

    if (!subCategory) next(new AppError('Sorry SubCategory is not exist', 400));

    if (req.body.name) {
        if (req.body.name.toLowerCase() == subCategory.name) {
            return next(new AppError('Sorry you cant update SubCategory with the same Name', 400))
        }
        if (await subCategoryModel.findOne({ name: req.body.name })) { return next(new AppError('duplicate SubCategory name', 409)) }


        subCategory.slug = slugify(req.body.name)
        subCategory.name = req.body.name
    }
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLODINARY_FOLDER}/category/${categoryId}/subCat/${subCategory.customId}` })

        await cloudinary.uploader.destroy(subCategory.imag.public_id)

        subCategory.imag = { public_id, secure_url }



    }

    subCategory.updatedBy=req.user._id

    await subCategory.save()


    res.status(200).json({ message: 'done', subCategory })


})




export const deleteSubCategory = asyncErrorHandler(async (req, res, next) => {

    const SubCategory = await subCategoryModel.findByIdAndDelete(req.params.subCategoryId)
    if (!SubCategory) next(new AppError('Sorry SubCategory is not exist', 400))






    res.status(200).json({ message: 'done', SubCategory })


})


