import slugify from "slugify";
import categoryModel from "../../../../DB/models/category.model.js";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import { nanoid } from "nanoid";
import cloudinary from "../../../utilies/cloudinary.js";















export const createCategory = asyncErrorHandler(async (req, res, next) => {

    const name = req.body.name.toLowerCase()
    if (!req.file) { return next(new AppError("file is required")) }
    // const file =req.file.dest
    // const customId = nanoid()

    await categoryModel.findOne(req.body) && next(new AppError('duplication of cat Name ', 409))

    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder:`${process.env.CLODINARY_FOLDER}/category/${slugify(name)}` })

    // const valid=createCategorySchema.validate({...req.body,file:req.file},{abortEarly:false})

    // // return res.status(400).json("validation",valid?.error)

    const catFile = new categoryModel({
        name,
        slug: slugify(name),
        image: { public_id, secure_url },
        createdBy: req.user._id,
    })
    const category = await catFile.save()

    res.status(201).json({ message: 'done', category })


})


export const getAllCategory = asyncErrorHandler(async (req, res, next) => {

    const category = await categoryModel.find({

    }).populate([{
        path: 'subcategoty'
    }])

    res.status(201).json({ message: 'done', category })


})



export const updateCategory = asyncErrorHandler(async (req, res, next) => {
    // if(!req.params.categoryId){ return next(new AppError('category id is required',  409 ))}
    const category = await categoryModel.findById(req.params.categoryId)

    if (!category) next(new AppError('Sorry category is not exist', 400));

    if (req.body.name) {
        if (req.body.name.toLowerCase() == category.name) {
            return next(new AppError('Sorry you cant update Category with the same Name', 400))
        }
        if (await categoryModel.findOne({ name: req.body.name })) { return next(new AppError('duplicate category name', 409)) }


        category.slug = slugify(req.body.name)
        category.name = req.body.name
    }
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder:`${process.env.CLODINARY_FOLDER}/category/${category.slug}` })

        await cloudinary.uploader.destroy(category.image?.public_id)

        category.image = { public_id, secure_url }



    }
    category.updatedBy = req.user._id

    await category.save()


    res.status(200).json({ message: 'done', category })


})




export const deleteCategory = asyncErrorHandler(async (req, res, next) => {

    const category = await categoryModel.findByIdAndDelete(req.params.categoryId)
    if (!category) next(new AppError('Sorry category is not exist', 400))






    res.status(200).json({ message: 'done', category })


})