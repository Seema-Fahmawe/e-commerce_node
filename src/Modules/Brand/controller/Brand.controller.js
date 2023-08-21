import slugify from 'slugify';
import brandModel from '../../../../DB/model/Brand.model.js';
import cloudinary from '../../../Services/cloudinary.js';
import { asyncHandler } from './../../../Services/errorHandling.js';

export const getBrands = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;
    const brand = await brandModel.find({ categoryId });
    return res.status(200).json({ message: 'success', brand });
});

export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { categoryId } = req.body;

    if (await brandModel.findOne({ name })) {
        return next(new Error(`Duplicate brand name`, { cause: 409 }));
    }

    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/brand` });
    const brand = await brandModel.create({ name, categoryId, image: { public_id, secure_url }, createdBy: req.user._id, updatedBy: req.user._id });
    return res.status(201).json({ message: 'success', brand });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
    const { brandId } = req.params;
    const brand = await brandModel.findOne({ _id: brandId });
    if (!brand) {
        return next(new Error(`invalid brand id ${brandId}`, { cause: 400 }));
    }
    if (req.body.name) {
        if (brand.name === req.body.name) {
            return next(new Error(`old name match new name`, { cause: 400 }));
        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicate brand name`, { cause: 400 }));
        }
        brand.name = req.body.name;
        brand.slug = slugify(req.body.name);
    }

    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.App_Name}/brand` });
        await cloudinary.uploader.destroy(brand.image.public_id);
        brand.image = { public_id, secure_url };
    }
    brand.createdBy = req.user._id;
    brand.updatedBy = req.user._id;
    await brand.save();
    return res.json({ message: 'success', brand });
})
