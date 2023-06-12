import { Router } from "express";
import * as reviewsController from"./controller/reviwes.controller.js"
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./reviews.endPoints.js";
import { isValid } from "../../middleware/validation.js";
import { createReviewSchema, updateReviewSchema } from "./reviwes.validation.js";




const router = Router({ mergeParams: true })

router.post('/',auth(endPoint.create),isValid(createReviewSchema),reviewsController.createReview)
router.put('/:reviewId',auth(endPoint.update),isValid(updateReviewSchema),reviewsController.updateReview)





export default router