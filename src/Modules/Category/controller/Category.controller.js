import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import categoryModel from './../../../../DB/model/Category.model.js';
import { asyncHandler } from './../../../Services/errorHandling.js';

export const getAllCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.find().populate('subcategory');
    return res.json({ message: 'success', category });
});

export const getCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId);
    return res.json({ message: 'success', category });
});

export const createCategory = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return next(new Error(`Duplicate category name`, { cause: 409 }));
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/category` });
    const slug = slugify(name);
    const category = await categoryModel.create({
        name, slug, image: { public_id, secure_url },
        createdBy: req.user._id, updatedBy: req.user._id
    });
    return res.status(201).json({ message: 'success', category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId);
    if (!category) {
        return next(new Error(`invalid category id ${req.params.categoryId}`, { cause: 400 }));
    }
    const name = req.body.name?.toLowerCase();
    if (name) {
        if (category.name === name) {
            return next(new Error(`old name match new name`, { cause: 400 }));
        }
        if (await categoryModel.findOne({ name })) {
            return next(new Error(`Duplicate category name`, { cause: 400 }));
        }
        category.name = req.body.name;
        category.slug = slugify(name);
    }
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/category` });
        await cloudinary.uploader.destroy(category.image.public_id);
        category.image = { public_id, secure_url };
    }
    category.createdBy = req.user._id;
    category.updatedBy = req.user._id;
    await category.save();
    return res.json({ message: 'success', category });
});

export const getProducts = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const product = await categoryModel.findOne({ _id: categoryId }).populate({
        path: 'products',
        match: { isDeleted: { $eq: false } },
    });
    return res.status(200).json({ message: 'success', product });
})