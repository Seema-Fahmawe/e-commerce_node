import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import subCategoryModel from './../../../../DB/model/SubCategory.model.js';
import { asyncHandler } from './../../../Services/errorHandling.js';

export const createSubCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    if (await subCategoryModel.findOne({ name })) {
        return next(new Error(`Duplicate subcategory name`, { cause: 409 }));
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/subCategory` });
    const subCategory = await subCategoryModel.create({ name, categoryId, slug: slugify(name), image: { public_id, secure_url }, createdBy: req.user._id, updatedBy: req.user._id });
    return res.status(201).json({ message: 'success', subCategory });
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { categoryId, subCategoryId } = req.params;
    const subCategory = await subCategoryModel.findOne({ _id: subCategoryId, categoryId });
    if (!subCategory) {
        return next(new Error(`invalid subCategory id ${req.params.subCategoryId}`, { cause: 400 }));
    }
    if (req.body.name) {
        if (subCategory.name === req.body.name) {
            return next(new Error(`old name match new name`, { cause: 400 }));
        }
        if (await subCategoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicate subCategory name`, { cause: 400 }));
        }
        subCategory.name = req.body.name;
        subCategory.slug = slugify(req.body.name);
    }
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/subCategory` });
        await cloudinary.uploader.destroy(subCategory.image.public_id);
        subCategory.image = { public_id, secure_url };
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    await subCategory.save();
    return res.json({ message: 'success', subCategory });
});

export const getSubCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const subCategory = await subCategoryModel.find({ categoryId });
    return res.json(subCategory);
});

export const getAllSubCategory = asyncHandler(async (req, res, next) => {
    const subCategories = await subCategoryModel.find().populate({
        path: 'categoryId',
        select: 'name image',
    });
    return res.json({ message: 'success', subCategories });
});

export const getProducts = asyncHandler(async (req, res, next) => {
    const { subCategoryId } = req.params;
    const product = await subCategoryModel.findOne({ _id: subCategoryId }).populate({
        path: 'products',
        match: { isDeleted: { $eq: false } },
        populate: { path: 'reviews' }
    });
    return res.status(200).json({ message: 'success', product });
})
