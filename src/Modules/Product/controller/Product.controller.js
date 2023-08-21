
import slugify from 'slugify';
import brandModel from '../../../../DB/model/Brand.model.js';
import subCategoryModel from '../../../../DB/model/SubCategory.model.js';
import { asyncHandler } from './../../../Services/errorHandling.js';
import productModel from '../../../../DB/model/Product.model.js';
import cloudinary from '../../../Services/cloudinary.js';

export const createProduct = asyncHandler(async (req, res, next) => {
    const { name, subCategoryId, categoryId, brandId, discount, price } = req.body;
    const checkCategory = await subCategoryModel.findOne({ _id: subCategoryId, categoryId });
    if (!checkCategory) {
        return next(new Error('invalid category or sub category', { cause: 400 }));
    }
    const checkBrand = await brandModel.findOne({ _id: brandId });
    if (!checkBrand) {
        return next(new Error('invalid brand', { cause: 400 }));
    }
    req.body.slug = slugify(name);
    req.body.finalPrice = price - (price * ((discount || 0) / 100));
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.App_Name}/product` });
    req.body.mainImage = { public_id, secure_url };
    if (req.files.subImages) {
        req.body.subImages = [];
        for (const file of req.files.subImages) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.App_Name}/product/subImages` });
            req.body.subImages.push({ public_id, secure_url });
        }
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const product = await productModel.create(req.body);
    if (!product) {
        return next(new Error('fail to create product', { cause: 400 }));
    }
    return res.json({ message: 'success', product });
})

export const updateProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
        return next(new Error('product not found', { cause: 400 }));
    }
    const { name, price, discount, categoryId, subCategoryId, brandId, description, stock, colors, sizes } = req.body;
    if (categoryId && subCategoryId) {
        const checkSubCategory = await subCategoryModel.findOne({ _id: subCategoryId, categoryId });
        if (checkSubCategory) {
            product.categoryId = categoryId;
            product.subCategoryId = subCategoryId;
        }
        else {
            return next(new Error('category id or sub category id not found', { cause: 400 }));
        }
    } else if (subCategoryId) {
        const checkSubCategory = await subCategoryModel.findOne({ _id: subCategoryId });
        if (checkSubCategory) {
            product.subCategoryId = subCategoryId;
        }
        else {
            return next(new Error('sub category id not found', { cause: 400 }));
        }
    }
    if (brandId) {
        const checkBrand = await brandModel.findOne({ _id: brandId });
        if (!checkBrand) {
            return next(new Error('brand id not found', { cause: 400 }));
        } else {
            product.brandId = brandId;
        }
    }
    if (name) {
        product.name = name;
        product.slug = slugify(name);
    }
    if (description) {
        product.description = description;
    }
    if (stock) {
        product.stock = stock;
    }
    if (colors) {
        product.colors = colors;
    }
    if (sizes) {
        product.sizes = sizes;
    }
    if (price && discount) {
        product.price = price;
        product.discount = discount;
        product.finalPrice = price - (price * ((discount || 0) / 100));
    } else if (price) {
        product.price = price;
        product.finalPrice = price - (price * ((product.discount || 0) / 100));
    } else if (discount) {
        product.discount = discount;
        product.finalPrice = product.price - (product.price * ((discount || 0) / 100));
    }
    if (req.files.mainImage) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.App_Name}/product` });
        await cloudinary.uploader.destroy(product.mainImage.public_id);
        product.mainImage.public_id = public_id;
        product.mainImage.secure_url = secure_url;
    }
    if (req.files.subImages) {
        const subImages = [];
        for (const file of req.files.subImages) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.App_Name}/product/subImages` });
            subImages.push({ public_id, secure_url });
        }
        product.subImages = subImages;
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    const newProduct = await product.save();
    if (!newProduct) {
        return next(new Error('fail to update product', { cause: 400 }));
    }
    return res.json({ message: 'success', newProduct });
})

export const softDelete = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!product) {
        return next(new Error('product not found', { cause: 400 }));
    }
    return res.json({ message: 'success', product });
})

export const forceDelete = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await productModel.findOneAndDelete({ _id: productId, isDeleted: true });
    if (!product) {
        return next(new Error('product not found', { cause: 400 }));
    }
    return res.json({ message: 'success', product });
})

export const restoreProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await productModel.findOneAndUpdate({ _id: productId, isDeleted: true }, { isDeleted: false }, { new: true });
    if (!product) {
        return next(new Error('product not found', { cause: 400 }));
    }
    return res.json({ message: 'success', product });
})

export const getSoftDeleteProduct = asyncHandler(async (req, res, next) => {
    const products = await productModel.findOne({ isDeleted: true });
    if (!products) {
        return next(new Error('product not found', { cause: 400 }));
    }
    return res.status(200).json({ message: 'success', products });
})

export const productDetails = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const product = await productModel.findById(productId).populate('reviews');
    if (!product) {
        return next(new Error('product not found', { cause: 400 }));
    }
    return res.status(200).json({ message: 'success', product });
})

export const allProducts = asyncHandler(async (req, res, next) => {

    let { page, size } = req.query;
    if (!page || page <= 0) {
        page = 1;
    }
    if (!size || size <= 0) {
        size = 3;
    }
    const skip = (page - 1) * size;
    const excQueryParams = ['page', 'size', 'sort', 'search'];
    const filterQuery = { ...req.query };
    excQueryParams.map(params => {
        delete filterQuery[params];
    })
    const query = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match => `$${match}`));
    const mongoQuery = await productModel.find(query).limit(size).skip(skip).sort(req.query.sort?.replaceAll(',', ' '));
    const products = await mongoQuery.find({
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } },
        ]
    });

    if (!products) {
        return next(new Error('products not found', { cause: 400 }));
    }
    return res.status(200).json({ message: 'success', products });
})