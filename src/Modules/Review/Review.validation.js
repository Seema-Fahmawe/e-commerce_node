import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const createReview = joi.object({
    productId: generalFeilds.id,
    comment: joi.string().required(),
    rating: joi.number(),
}).required();

export const updateReview = joi.object({
    productId: generalFeilds.id,
    reviewId: generalFeilds.id,
    comment: joi.string(),
    rating: joi.number(),
}).required();

export const getCoupon = joi.object({
    couponId: generalFeilds.id,
}).required();