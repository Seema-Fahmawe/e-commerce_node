import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: [{
        type: String,
        required: true,
    }],
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        description: { type: String },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
    }],
    couponId: {
        type: Types.ObjectId,
        ref: 'Coupon',
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    paymentType: {
        type: String,
        default: 'cash',
        enum: ['cash', 'card'],
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'canceled', 'approved', 'onWay', 'delivered'],
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    reasonReject: { type: String },
    note: { type: String },
}, {
    timestamps: true,
})
const orderModel = mongoose.models.Order || model('Order', orderSchema);
export default orderModel;