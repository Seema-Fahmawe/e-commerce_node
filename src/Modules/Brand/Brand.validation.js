import joi from 'joi';
import { generalFeilds } from './../../Middleware/validation.js';

export const createBrand = joi.object({
    name: joi.string().min(2).max(20).required(),
    categoryId: generalFeilds.id,
    file: generalFeilds.file.required(),
}).required();

export const updateBrand = joi.object({
    brandId: generalFeilds.id,
    name: joi.string().min(2).max(20),
    file: generalFeilds.file,
}).required();

export const getBrands = joi.object({
    categoryId: generalFeilds.id,
}).required();
