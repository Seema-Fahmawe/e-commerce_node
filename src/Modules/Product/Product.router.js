import { Router } from "express";
import * as productController from './controller/Product.controller.js';
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Product.endPoints.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import validation from "../../Middleware/validation.js";
import * as validators from './Product.validation.js';
import reviewRouter from '../Review/Review.router.js';
const router = Router({mergeParams:true});

router.use('/:productId/review',reviewRouter);

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
]), validation(validators.createProduct), productController.createProduct);

router.put('/update/:productId', auth(endPoint.update), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 },
]), validation(validators.updateProduct), productController.updateProduct);

router.patch('/softDelete/:productId', validation(validators.softDelete), auth(endPoint.softDelete), productController.softDelete);
router.delete('/forceDelete/:productId', validation(validators.forceDelete), auth(endPoint.forceDelete), productController.forceDelete);
router.patch('/restore/:productId', auth(endPoint.restore), validation(validators.restoreProduct), productController.restoreProduct);
router.get('/softDelete', auth(endPoint.get), productController.getSoftDeleteProduct);
router.get('/:productId', auth(endPoint.get), validation(validators.productDetails), productController.productDetails);
router.get('/',  productController.allProducts);
export default router;
