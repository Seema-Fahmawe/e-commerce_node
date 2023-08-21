import joi from 'joi';
import { generalFeilds } from './../../Middleware/validation.js';

export const createCategory = joi.object({
    name: joi.string().min(3).max(20).required(),
    file: generalFeilds.file.required(),
}).required();

export const updateCategory = joi.object({
    categoryId: generalFeilds.id,
    name: joi.string().min(3).max(20),
    file: generalFeilds.file,
}).required();

export const getCategory = joi.object({
    categoryId: generalFeilds.id,
}).required();

export const getProducts = joi.object({
    categoryId: generalFeilds.id,
}).required();