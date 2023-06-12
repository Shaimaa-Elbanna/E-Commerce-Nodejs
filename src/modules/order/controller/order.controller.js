import cartModel from "../../../../DB/models/cart.model.js";
import copounModel from "../../../../DB/models/copoun.model.js";
import orderModel from "../../../../DB/models/order.model.js";
import productModel from "../../../../DB/models/product.model.js";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import { createInvoice } from "../../../utilies/pdf.js";
import sendEmail from "../../../utilies/sendEmail.js";
import { removeAllCartItems, removeItemsFromCart } from "../../cart/contrroller/cart.controller.js";






export const createOrder = asyncErrorHandler(async (req, res, next) => {
    const { adress, phone, copounName, payment } = req.body

    if (!req.body.products) {

        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart?.products?.length) {

            return next(new AppError("cart not exist", 400))

        }

        req.body.products = cart.products
        req.body.isCart = true
    }



    if (copounName) {
        const copoun = await copounModel.findOne({ name: copounName, usedBy: { $nin: req.user._id } })

        if (!copoun) {
            return next(new AppError('copoun is not exist or user'), 404)
        }

        if (copoun.expirDate.getTime() < Date.now()) {
            return next(new AppError('copoun is expired'), 400)


        }

        req.body.copoun = copoun
    }

    let subTotal = 0
    const finalProductList = []
    const productIds = []
    for (let product of req.body.products) {

        const checkProduct = await productModel.findOne({
            _id: product.productId,

            stock: { $gte: product.quantity },
            isDeleted: false
        })
        if (!checkProduct) {

            return next(new AppError('product is not avilable'))
        }

        if (req.body.isCart) {
            product = product.toObject()
        }
        productIds.push(product.productId)
        product.name = checkProduct.name
        product.unitPrice = checkProduct.price
        product.finalPrice = product.quantity * checkProduct.finalPrice.toFixed(2)
        subTotal += product.finalPrice
        finalProductList.push(product)

    }



    const order = await orderModel.create({
        userId: req.user._id,
        adress,
        phone,
        note: req.body?.note,
        products: finalProductList,
        copounId: req.body.copoun?._id,
        subTotal,
        finalPrice: subTotal - (subTotal * (req.body.copoun?.amount || 0) / 100).toFixed(2),
        payment,
        orderStatus: payment ? "waitPayment" : "placed",
        reasone: req.body?.reason
    })

    for (const product of req.body.products) {
        await productModel.updateOne({ _id: product.product }, { $inc: { stock: -product.quantity } })
    }

    await copounModel.updateOne({ name: copounName }, { $addToSet: { usedBy: req.user._id } })

    if (req.body.isCart) {
    const removeCart=    await removeAllCartItems(req.user._id)
        return removeCart?res.json({message:"done"}):next(new AppError('cant remove cart',400))
    }

await removeItemsFromCart( req.user._id,productIds)




 const invoice = {
  shipping: {
    name: req.user.name,
    address: order.adress,
    city: "Cairo",
    state: "Cairo",
    country: "egypt",
    postal_code: 94111
  },
  items: order.products,
  
  subtotal: order.subTotal,
  total: order.finalPrice,
  invoice_nr: order._id,
//   Date:order.createdAt
};



await createInvoice(invoice, "invoice.pdf");

await sendEmail({to:req.user.email,subject:"invoive",attachments:[
    {path: "invoice.pdf",
contentType:"application/pdf"
}
]})


    res.status(201).json({ message: "done", order })




})







export const cancelOrder = asyncErrorHandler(async (req, res, next) => {

    const { orderId } = req.params


    const order = await orderModel.findOne({ userId: req.user._id, _id: orderId })

    if (!order) {
        return next(new AppError('order is not exist', 404))
    }

    if ((order?.orderStatus != "placed" && order?.payment != "cash") || (order?.orderStatus != "waitPayment" && order?.payment != "card"))
        return next(new AppError(`you can not cancel your order as it is ${order.orderStatus}`, 400))



    const cancel = await orderModel.updateOne({ _id: orderId }, { orderStatus: "canceled", reason: req.body.reason, updatedBy: req.user._id })

    if (!cancel) {
        return next(new AppError(`fail to cancel the order`, 400))

    }

    for (const product of order.products) {

        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } })
    }
    if (order.copounId) {
        await copounModel.updateOne({ _id: order.copounId }, { $pull: { usedBy: req.user._id } })
    }

    return res.status(200).json({ message: "Done" })

})








export const orderStatusByAdmin = asyncErrorHandler(async (req, res, next) => {

    const { orderId } = req.params

    const { orderStatus } = req.body

    const order = await orderModel.findOne({ _id: orderId })

    if (!order) {
        return next(new AppError('order is not exist', 404))
    }


    if (orderStatus != "rejected") {


        const status =await orderModel.updateOne({ _id: orderId }, { orderStatus, updatedBy: req.user._id })
        if (!status.modifiedCount) {

            return next(new AppError(`fail to update the order status`, 400))

        }

        return res.status(200).json({ message: "Done", status })

    }




    if ((order?.orderStatus == "onWay" && order?.payment == "cash") || (order?.orderStatus == "waitPayment" && order?.payment == "card")) {
        return next(new AppError(`you can not cancel your order as it is ${order.orderStatus}`, 400))
    }

    const reject = await orderModel.updateOne({ _id: orderId }, { orderStatus: "rejected", updatedBy: req.user._id })

    if (!reject.matchedCount) {
        return next(new AppError(`fail to cancel the order`, 400))

    }

    for (const product of order.products) {

        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } })
    }
    if (order.copounId) {
        await copounModel.updateOne({ _id: order.copounId }, { $pull: { usedBy: req.user._id } })
    }
    return res.status(200).json({ message: "Done", reject })










})