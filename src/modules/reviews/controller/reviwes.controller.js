import orderModel from "../../../../DB/models/order.model.js";
import reviewsModel from "../../../../DB/models/reviews.model.js";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";



export const createReview = asyncErrorHandler(async (req, res, next) => {

    const {productId} = req.params
    const { rate, comment } = req.body


    const checkOrder = await orderModel.findOne({
        userId: req.user._id,
        orderStatus: "deliverd",
        "products.productId": productId,

    })

    if (!checkOrder) {
        return next(new AppError('you are not allowed to rate this product',400))
    }


    if (await reviewsModel.findOne({ createdBy: req.user._id, orderId: checkOrder._id, productId })) {

        return next(new AppError('you already have reviwed this product before',400))

    }

    const review = await reviewsModel.create({
        rate,
        comment,
        orderId: checkOrder._id,
        createdBy: req.user._id,
        productId,
        $inc:{numReviews:1}
    })

    return res.status(201).json({ message: "Done", review })

})





export const updateReview = asyncErrorHandler(async (req, res, next) => {

    const {productId,reviewId} = req.params
   



    const review = await reviewsModel.updateOne({_id:reviewId,productId,createdBy:req.user._id},req.body)
    if(!review){
        return next(new AppError('you can not reviwe this product before',400))

    }

    return res.status(201).json({ message: "Done" })

})
