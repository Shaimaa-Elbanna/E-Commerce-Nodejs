import Stripe from "stripe";
import cartModel from "../../../../DB/models/cart.model.js";
import copounModel from "../../../../DB/models/copoun.model.js";
import orderModel from "../../../../DB/models/order.model.js";
import productModel from "../../../../DB/models/product.model.js";
import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import cardPayment from "../../../utilies/payment.js";
import { createInvoice } from "../../../utilies/pdf.js";
import sendEmail from "../../../utilies/sendEmail.js";
import { removeAllCartItems, removeItemsFromCart } from "../../cart/contrroller/cart.controller.js";






export const createOrder = asyncErrorHandler( async (req, res, next) => {
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
        const removeCart = await removeAllCartItems(req.user._id)
        return removeCart ? res.json({ message: "done" }) : next(new AppError('cant remove cart', 400))
    }

    await removeItemsFromCart(req.user._id, productIds)




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

    await sendEmail({
        to: req.user.email, subject: "invoive", attachments: [
            {
                path: "invoice.pdf",
                contentType: "application/pdf"
            }
        ]
    })


    if (order.payment == "card") {

        const stripe = new Stripe(process.env.STRIPE_KEY)
        if (req.body.copoun) {
            const coupon = await stripe.coupons.create({ percent_off: req.body.copoun.amount, duration: 'once' })
            req.body.copounId = coupon.id
            console.log(coupon);
        }

        const session = await cardPayment({
            stripe,
            customer_email: req.user.email,
            discounts: req.body.copounId ? [{ coupon: req.body.copounId }] : [],
            metadata: {
                orderId: order._id.toString()
            },
            cancel_url: `${process.env.CANCEL_URL}?orderId=${order._id.toString()}`,
            line_items: order.products.map(product => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.name
                        },
                        unit_amount: product.unitPrice * 100
                    },
                    quantity: product.quantity
                }
            }
            ),



        }
        )
     return    res.status(201).json({ message: "done", order, url: session.url })

    }


   return  res.status(201).json({ message: "done", order })




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
    if (order.copounId = copoun.id) {
        await copounModel.updateOne({ _id: order.copounId = copoun.id }, { $pull: { usedBy: req.user._id } })
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


        const status = await orderModel.updateOne({ _id: orderId }, { orderStatus, updatedBy: req.user._id })
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
    if (order.copounId = copoun.id) {
        await copounModel.updateOne({ _id: order.copounId = copoun.id }, { $pull: { usedBy: req.user._id } })
    }
    return res.status(200).json({ message: "Done", reject })










})



export const webhook =asyncErrorHandler( async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_KEY)
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    const { orderId } = event.data.object.metadata
 console.log(orderId);

    if (event.type != 'checkout.session.completed') {
        await orderModel.updateOne({ _id: orderId }, { orderStatus: 'rejected' })
        return res.status(400).json({message:'rejected order'})
    }

    await orderModel.updateOne({ _id: orderId }, { orderStatus: 'placed' })
    return res.status(200).json({message:'Done'})

     
})
