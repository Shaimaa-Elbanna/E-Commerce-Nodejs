import slugify from "slugify";
import brandModel from "../../../../DB/models/brand.model.js";
import subCategoryModel from "../../../../DB/models/subCategory.model .js";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import { nanoid } from "nanoid";
import cloudinary from "../../../utilies/cloudinary.js";
import productModel from "../../../../DB/models/product.model.js";
import userModel from "../../../../DB/models/user.model.js";
import  ApiFeatures  from "../../../utilies/apiFeatures.js";



export const getProduct = asyncErrorHandler(async (req, res, next) => {



    const apiFeatures = new ApiFeatures(req.query, productModel.find().populate({ path: 'review'} ).populate(   { path:'brand',options: {select :"name"}}
    )
).sort().fields().seacrch().filter().pagination()
    

    const products = await apiFeatures.mongooseQuery

    for(let i=0; i<products.length ;i++){
       const calcRating =0
       for (let j = 0; j < products[i].review.length; j++) {
        
        calcRating +=products[i].review[j].rate
       }

       let avgRating =calcRating/ products[i].review.length

       const product = products[i].toObject()
        product.avgRating=avgRating
        products[i]=product
       
    }



    // products.forEach(product => {
    //     let calc =0
    //     let i =0
    //     product.review.forEach(rev,)
    //     calcRating += review.rate
    
        
    //    });
    
    //    const avgRating =calcRating/i
    
    // })

    // let Product =products.Object()
    // product.avgRating=avgRating

  


    return res.status(200).json({ message: "done",page:apiFeatures.page, products})

})



export const createProduct = asyncErrorHandler(async (req, res, next) => {

    const { name, categoryId, subCategoryId, brandId, price, discount } = req.body


    if (!await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {

        next(new AppError('in-valid categoryId or subcategoryId', 400))
    }

    if (!await brandModel.findOne({ _id: brandId })) {
        next(new AppError('in-valid brandID', 400))

    }

    req.body.slug = slugify(name, {
        replacement: "-",
        lower: true,
        trim: true
    })

    req.body.finalPrice = Number.parseFloat(price - (price * (discount || 0) / 100)).toFixed(2)


    req.body.customId = nanoid()


    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.CLODINARY_FOLDER}/product/mainImage/${req.body.customId}` })


    req.body.mainImage = { secure_url, public_id }


    if (req.files.subImages) {
        req.body.subImages = []

        for (const file of req.files.subImages) {

            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.CLODINARY_FOLDER}/product/subimage/${req.body.customId}` })


            req.body.subImages.push({ secure_url, public_id })
        };
    }

    const product = await productModel.create(req.body)


    if (!product) {
        next(new AppError('fialed to create this product', 400))

    }

    res.status(201).json({ message: "done", product })


})




export const updateProduct = asyncErrorHandler(async (req, res, next) => {

    const { productId } = req.params
    const { name, categoryId, subCategoryId, brandId, price, discount } = req.body

    const product = await productModel.findById(productId)
    if (!product) {
        next(new AppError('product not found , wrong productId', 404))

    }
    if (categoryId && subCategoryId) {
        if (!await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {

            next(new AppError('in-valid categoryId or subcategoryId', 400))
        }
    }

    if (brandId) {
        if (!await brandModel.findOne({ _id: brandId })) {
            next(new AppError('in-valid brandID', 400))

        }
    }

    if (name) {
        req.body.slug = slugify(name, {
            replacement: "-",
            lower: true,
            trim: true
        })
    }

    if (price && discount) {
        req.body.finalPrice = Number.parseFloat(price - (price * (discount / 100))).toFixed(2)
    }

    else if (price) {
        req.body.finalPrice = Number.parseFloat(price - (price * (product.discount / 100))).toFixed(2)

    }
    else if (discount) {
        req.body.finalPrice = Number.parseFloat(product.price - (product.price * (product.discount / 100))).toFixed(2)

    }



    if (req.files?.mainImage?.length) {

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.CLODINARY_FOLDER}/product/mainImage/${product.customId}` })

        await cloudinary.uploader.destroy(product.mainImage.public_id)

        req.body.mainImage = { secure_url, public_id }
    }


    if (req.files?.subImages?.length) {

        req.body.subImages = []

        for (const file of req.files.subImages) {

            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.CLODINARY_FOLDER}/product/subimage/${req.body.customId}` })

            if (product.subImages?.length) {
                for (const file of product.subImages) {
                    await cloudinary.uploader.destroy(file.public_id)
                }
            }
            req.body.subImages.push({ secure_url, public_id })
        };
    }

    const newProduct = await productModel.updateOne({ _id: productId }, req.body)


    if (!newProduct) {
        next(new AppError('fialed to create this product', 400))

    }

    res.status(200).json({ message: "done", newProduct })


})



export const addToUserWishlist = asyncErrorHandler(async (req, res, next) => {


    if (! await productModel.findById(req.params.productId)) {
        return next(new AppError('product is not exist', 400))
    }


    const wishlsit = await userModel.updateOne({ _id: req.user._id }, { $addToSet: { userWishList: req.params.productId } })

    return res.status(200).json({ message: 'done', wishlsit })
})



export const removeToUserWishlist = asyncErrorHandler(async (req, res, next) => {





    const wishlsit = await userModel.updateOne({ _id: req.user._id }, { $pull: { userWishList: req.params.productId } })

    return res.status(200).json({ message: 'done', wishlsit })
})