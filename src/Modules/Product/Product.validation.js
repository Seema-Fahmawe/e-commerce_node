import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createProduct = joi.object({
    name: joi.string().min(3).max(20).required(),
    description: joi.string().min(3).max(20),
    subCategoryId: generalFeilds.id,
    categoryId: generalFeilds.id,
    brandId: generalFeilds.id,
    discount: joi.number(),
    price: joi.number().positive().required(),
    stock: joi.number().positive(),
    file: generalFeilds.file,
}).required();

export const updateProduct = joi.object({
    productId: generalFeilds.id,
    categoryId: generalFeilds.id,
    subCategoryId: generalFeilds.id,
    brandId: generalFeilds.id,
    discount: joi.number(),
    description: joi.string().min(3).max(20),
    stock: joi.number().positive(),
    price: joi.number().positive(),
    name: joi.string().min(3).max(20),
    file: generalFeilds.file,
}).required();

export const softDelete = joi.object({
    productId: generalFeilds.id,
}).required();

export const restoreProduct = joi.object({
    productId: generalFeilds.id,
}).required();

export const forceDelete = joi.object({
    productId: generalFeilds.id,
}).required();

export const productDetails = joi.object({
    productId: generalFeilds.id,
}).required();