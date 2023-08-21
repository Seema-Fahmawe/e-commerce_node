import joi from 'joi';
import { generalFeilds } from './../../Middleware/validation.js';

export const createCart = joi.object({
    productId: generalFeilds.id,
    qty: joi.number().positive(),
}).required();

export const deleteItem = joi.object({
    productIds: joi.array(),
}).required();

