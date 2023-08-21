import couponModel from '../../../../DB/model/Coupon.model.js';
import { asyncHandler } from './../../../Services/errorHandling.js';

export const getAllCoupons = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.find();
    return res.json({ message: 'success', coupon });
});

export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId);
    return res.json({ message: 'success', coupon });
});

export const createCoupon = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    let date = new Date(req.body.expireDate);
    let now = new Date();
    if (now.getTime() >= date.getTime()) {
        return next(new Error('invalid date', { cause: 400 }));
    }
    date = date.toLocaleDateString();
    req.body.expireDate = date;

    if (await couponModel.findOne({ name })) {
        return next(new Error(`Duplicate coupon name `, { cause: 409 }));
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const coupon = await couponModel.create(req.body);
    return res.status(201).json({ message: 'success', coupon });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.couponId);
    if (!coupon) {
        return next(new Error(`invalid coupon id ${req.params.couponId}`, { cause: 400 }));
    }
    if (req.body.name) {
        if (coupon.name === req.body.name) {
            return next(new Error(`old name match new name`, { cause: 400 }));
        }
        if (await couponModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicate coupon name`, { cause: 400 }));
        }
        coupon.name = req.body.name;
    }
    if (req.body.amount) {
        coupon.amount = req.body.amount;
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    await coupon.save();
    return res.json({ message: 'success', coupon });
});


