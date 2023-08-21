import { Router } from "express";
import * as reviewController from './controller/Review.controller.js';
import { auth, roles } from "../../Middleware/auth.middleware.js";
import * as validators from './Review.validation.js';
import { endPoint } from './Review.endPoint.js';
import validation from "../../Middleware/validation.js";
const router = Router({ mergeParams: true });

router.post('/', auth(endPoint.create), validation(validators.createReview), reviewController.createReview);
router.put('/update/:reviewId', auth(endPoint.update), validation(validators.updateReview), reviewController.updateReview);
export default router;