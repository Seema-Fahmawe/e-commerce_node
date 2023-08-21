import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const createSubCategory = joi.object({
    name: joi.string().min(2).max(20).required(),
    file: generalFeilds.file.required(),
    categoryId: generalFeilds.id,
}).required();

export const updateSubCategory = joi.object({
    categoryId: generalFeilds.id,
    subCategoryId: generalFeilds.id,
    name: joi.string().min(2).max(20),
    file: generalFeilds.file,
}).required();

export const getSubCategory = joi.object({
    categoryId: generalFeilds.id,
}).required();

export const getProducts = joi.object({
    subCategoryId: generalFeilds.id,
    categoryId: generalFeilds.id,
}).required();
