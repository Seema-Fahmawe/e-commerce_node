import { Router } from "express";
import * as orderController from './controller/Order.controller.js';
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Order.endPoints.js";
import * as validators from './Order.validation.js';
import validation from "../../Middleware/validation.js";
const router = Router();

router.post('/', auth(endPoint.create), validation(validators.createOrder), orderController.createOrder);
router.post('/OrderWithAllItemFromCart', auth(endPoint.createOrderWithAllItem), validation(validators.createOrderWithAllItemFromCart), orderController.createOrderWithAllItemFromCart);
router.patch('/cancel/:orderId', auth(endPoint.cancel), validation(validators.cancelOrder), orderController.cancelOrder);
router.patch('/orderStatus/:orderId', auth(endPoint.updateStatusOrder), validation(validators.updateStatusOrder), orderController.updateStatusOrder)
export default router;