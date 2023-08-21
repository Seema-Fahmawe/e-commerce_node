import { Router } from 'express';
import * as couponController from './controller/Coupon.controller.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Coupon.validation.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Coupon.endPoints.js';
const router = Router();

router.post('/', auth(endPoint.create), validation(validators.createCoupon), couponController.createCoupon);
router.put('/update/:couponId', auth(endPoint.update), validation(validators.updateCoupon), couponController.updateCoupon);
router.get('/', auth(Object.values(roles)), couponController.getAllCoupons);
router.get('/:couponId', auth(Object.values(roles)), validation(validators.getCoupon), couponController.getCoupon);
export default router;
