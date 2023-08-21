import { Router } from "express";
import * as cartController from './controller/Cart.controller.js';
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Cart.endPoints.js";
import validation from "../../Middleware/validation.js";
import * as validators from './Cart.validation.js';
const router = Router();

router.post('/', auth(endPoint.create), validation(validators.createCart), cartController.createCart);
router.patch('/deleteItem', auth(endPoint.deleteItem), validation(validators.deleteItem), cartController.deleteItem);
router.patch('/clearCart', auth(endPoint.clearCart), cartController.clearCart);
router.get('/', auth(endPoint.get), cartController.getCart);
export default router;