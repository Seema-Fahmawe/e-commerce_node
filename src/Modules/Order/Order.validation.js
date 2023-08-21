import joi from 'joi';
import { generalFeilds } from './../../Middleware/validation.js';

export const createOrder = joi.object({
    couponName: joi.string(),
    address: joi.string().required(),
    phoneNumber: joi.string().required(),
    paymentType: joi.string().required(),
    products: joi.required(),
}).required();

export const createOrderWithAllItemFromCart = joi.object({
    couponName: joi.string(),
    address: joi.string().required(),
    phoneNumber: joi.string().required(),
    paymentType: joi.string().required(),
}).required();

export const cancelOrder = joi.object({
    reasonReject: joi.string(),
    orderId: generalFeilds.id,
}).required();

export const updateStatusOrder = joi.object({
    orderId: generalFeilds.id,
    status: joi.string().required(),
}).required();