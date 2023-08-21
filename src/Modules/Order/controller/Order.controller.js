import moment from 'moment';
import { asyncHandler } from "../../../Services/errorHandling.js";
import couponModel from './../../../../DB/model/Coupon.model.js';
import productModel from './../../../../DB/model/Product.model.js';
import orderModel from './../../../../DB/model/Order.model.js';
import cartModel from './../../../../DB/model/Cart.model.js';
import createInvoice from '../../../Services/pdf.js';
import { sendEmail } from '../../../Services/sendEmail.js';

export const createOrder = asyncHandler(async (req, res, next) => {

    const { products, address, phoneNumber, couponName, paymentType } = req.body;
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase() });
        if (!coupon) {
            return next(new Error(`invalid coupon ${couponName}`, { cause: 400 }));
        }
        let now = moment();
        let parsed = moment(coupon.expireDate, 'DD/MM/YYYY');
        let diff = now.diff(parsed, 'days');
        if (diff >= 0) {
            return next(new Error('coupon is expired', { cause: 400 }));
        }
        if (coupon.usedBy.includes(req.user._id)) {
            return next(new Error(`coupon already used by ${req.user._id}`, { cause: 400 }));
        }
        req.body.coupon = coupon;
    }

    let subTotal = 0;
    const productIds = [];
    const finalProductList = [];
    for (const product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.qty },
            isDeleted: false,
        });
        if (!checkProduct) {
            return next(new Error('invalid product', { cause: 400 }));
        }
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice = product.qty * checkProduct.finalPrice;
        product.name = checkProduct.name;
        subTotal += product.finalPrice;
        productIds.push(product.productId);
        finalProductList.push(product);
    }
    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phoneNumber,
        products: finalProductList,
        couponId: req.body.coupon?._id,
        finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount | 0) / 100)),
        paymentType,
        status: (paymentType == 'card' ? 'approved' : 'pending'),
    });
    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -product.qty } })
    }
    if (req.body.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } });
    }
    await cartModel.updateOne({ userId: req.user._id }, {
        $pull: {
            products: {
                productId: { $in: productIds }
            }
        }
    })

    return res.status(200).json({ message: 'success', order });
})

export const createOrderWithAllItemFromCart = asyncHandler(async (req, res, next) => {

    let { products, address, phoneNumber, couponName, paymentType } = req.body;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart?.products?.length) {
        return next(new Error('empty cart', { cause: 400 }));
    }
    products = cart.products;
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName.toLowerCase() });
        if (!coupon) {
            return next(new Error(`invalid coupon ${couponName}`, { cause: 400 }));
        }
        let now = moment();
        let parsed = moment(coupon.expireDate, 'DD/MM/YYYY');
        let diff = now.diff(parsed, 'days');
        if (diff >= 0) {
            return next(new Error('coupon is expired', { cause: 400 }));
        }
        if (coupon.usedBy.includes(req.user._id)) {
            return next(new Error(`coupon already used by ${req.user._id}`, { cause: 400 }));
        }
        req.body.coupon = coupon;
    }

    let subTotal = 0;
    const productIds = [];
    const finalProductList = [];
    for (const product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.qty },
            isDeleted: false,
        });
        if (!checkProduct) {
            return next(new Error('invalid product', { cause: 400 }));
        }
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice = product.qty * checkProduct.finalPrice;
        product.name = checkProduct.name;
        product.description = checkProduct.description;
        subTotal += product.finalPrice;
        productIds.push(product.productId);
        finalProductList.push(product);
    }

    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phoneNumber,
        products: finalProductList,
        couponId: req.body.coupon?._id,
        finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount | 0) / 100)),
        paymentType,
        status: (paymentType == 'card' ? 'approved' : 'pending'),
    });

    for (const product of products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -product.qty } })
    }
    if (req.body.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } });
    }

    const invoice = {
        shipping: {
            name: req.user.userName,
            address: order.address,
            city: 'Nablus',
            state: "West Bank",
            country: "Palestine",
            postal_code: 94111
        },
        items: order.products,
        subTotal,
        total: order.finalPrice,
        invoice_nr: order._id
    };

    createInvoice(invoice, "invoice.pdf");
    await sendEmail(req.user.email, 'seema shop - invoice', 'welcome', {
        path: 'invoice.pdf',
        contentType: 'application/pdf'
    });
    await cartModel.updateOne({ userId: req.user._id }, { products: [] });
    return res.status(200).json({ message: 'success', order });
})

export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { reasonReject } = req.body;
    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id });
    if (!order || order.status != 'pending' || order.paymentType != 'cash') {
        return next(new Error("can't cancel this order", { cause: 400 }));
    }
    await orderModel.updateOne({ _id: order._id }, { status: 'canceled', reasonReject, updatedBy: req.user._id });
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.qty } });
    }
    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } });
    }
    return res.status(200).json({ message: 'success' });
})

export const updateStatusOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findOne({ _id: orderId });
    if (!order || order.status == 'delivered') {
        return next(new Error(`this order not found or this order status is ${order.status} `, { cause: 400 }));
    }
    const changeOrderStatus = await orderModel.updateOne({ _id: orderId }, { status, updatesBy: req.user._id });

    if (!changeOrderStatus) {
        return next(new Error(`fail to change status this order`, { cause: 400 }));
    }
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.qty } });
    }
    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } });
    }
    return res.status(200).json({ message: 'success' });
})