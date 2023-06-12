

import { Router } from 'express'
import * as productContoller from './controller/product.controller.js'
import * as validators from './product.validation.js'
import { isValid } from '../../middleware/validation.js'
import { auth } from '../../middleware/auth.js'
import endPoint from './product.endPoint.js'
import cloudFileUpload from '../../utilies/cloudinaryUploder.js'
import { fileValidation } from '../../utilies/fileUpload.js'
import reviwesRouter from "../reviews/reviwes.router.js"

const router = Router()

router.use("/:productId/review",reviwesRouter)
router.get('/',productContoller.getProduct)
router.post('/',isValid(validators.header,true) ,
auth(endPoint.create)
    , cloudFileUpload().fields([
        { name: 'mainImage', maxCount: 1 }
        , { name: 'subImages', maxCount: 5 }
    ])
    , isValid(validators.createProductSchema,false)
    , productContoller.createProduct)

router.put('/:productId',
auth(endPoint.update)
    , cloudFileUpload().fields([
        { name: 'mainImage', maxCount: 1 }
        , { name: 'subImages', maxCount: 5 }
    ])
    , isValid(validators.updateProductSchema)
    , productContoller.updateProduct)



router.patch('/:productId/wishlsit',  auth(endPoint.wishlist), isValid(validators.addToUserWishlistSchema)
, productContoller.addToUserWishlist)
router.patch('/:productId/removeWishlist',  auth(endPoint.wishlist) , isValid(validators.removeFromUserWishlistSchema)
, productContoller.removeToUserWishlist)


export default router