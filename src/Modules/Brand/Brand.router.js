import { Router } from "express";
import * as brandController from './controller/Brand.controller.js';
import fileUpload, { fileValidation } from './../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Brand.validation.js';
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Brand.endPoints.js";

const router = Router();
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), validation(validators.createBrand), brandController.createBrand);
router.get('/:categoryId', auth(Object.values(roles)), validation(validators.getBrands), brandController.getBrands);
router.put('/update/:brandId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'), validation(validators.updateBrand), brandController.updateBrand);

export default router;