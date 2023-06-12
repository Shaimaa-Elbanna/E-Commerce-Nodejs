import { AppError, asyncErrorHandler } from "../../../utilies/errorHandling.js";
import productModel from '../../../../DB/models/product.model.js'
import cartModel from "../../../../DB/models/cart.model.js";

export const createCart = asyncErrorHandler(async (req, res, next) => {

    const { productId, quantity } = req.body

    const product = await productModel.findById(productId)

    if (!productId) {
        return next(new AppError('product is not exist ', 400))
    }

    if (product.stock < quantity || product.isDeleted == true) {

        await productModel.updateOne({ _id: productId }, { $addToSet: { userWishList: req.user._Id } })

        return next(new AppError(`in-valid product quantity the avilable stock is ${product.stock}  `, 400))

    }

    const cart = await cartModel.findOne({ userId: req.user._id })



    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [{ productId, quantity }]
        })

        return res.status(201).json({ message: "Done", newCart })
    }

    let addMultiplePoduct = false


    // for (let i = 0; i < cart.products.length; i++) {

    //     if (cart.products[i].productId.toString() == productId) {
    //         cart.products[i].quantity[i] = quantity
    //         addMultiplePoduct = true
    //         break;

    //     }


    // }
    // cart.products.map(product => {
    //     if (product.productId.toString() == productId) {
    //         addMultiplePoduct = true
    //          product.quantity = quantity

    //     }
    // })


    cart.products.find(product => {
        if (product.productId.toString() == productId) {
            addMultiplePoduct = true
            return product.quantity = quantity

        }
    })

    if (!addMultiplePoduct) {
        cart.products.push({ productId, quantity })
    }



    await cart.save()
    return res.status(200).json({ message: "Done", cart })






    // let changedCart = false

    // if(cart.products.find(product=>product?.productId==productId)){
    //     changedCart = true
    //     return product.quantity == quantity
    // }


})




export const removeCart = asyncErrorHandler(async (req, res, next) => {


    const removeProducts = await removeItemsFromCart(req.user._id, req.body.productIds)

    return  removeProducts? res.status(200).json({ message: "Done", removeProducts }):next(new AppError("cant delete cart Product item",400))
     
})

export async function removeItemsFromCart(userId, productIds) {

    const cart =   await cartModel.updateOne({ userId }, {
        $pull:
        {
            products: { productId: { $in: productIds } }
        }
    })

return cart.modifiedCount
}


export async function removeAllCartItems(userId) {

    const cart =   await cartModel.updateOne({ userId }, {
       
            products:[]
        
    })

return cart.modifiedCount
}

export const clearCart = asyncErrorHandler(async (req, res, next) => {


    const removeProducts = await removeAllCartItems(req.user._id)

    return  removeProducts? res.status(200).json({ message: "Done", removeProducts }):next(new AppError("cant delete cart Product item",400))
     
})


