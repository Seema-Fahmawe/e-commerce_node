import { Router } from 'express';
import * as categoryController from './controller/Category.controller.js';
import * as validators from './Category.validation.js';
import subCategory from '../SubCategory/SubCategory.router.js';
import fileUpload, { fileValidation } from './../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import { endPoint } from './Category.endPoints.js';
const router = Router();

router.use('/:categoryId/subCategory', subCategory);
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), validation(validators.createCategory),
    categoryController.createCategory);

router.put('/update/:categoryId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'),
    validation(validators.updateCategory), categoryController.updateCategory);

router.get('/:categoryId', auth(Object.values(roles)), validation(validators.getCategory), categoryController.getCategory);
router.get('/', auth(Object.values(roles)), categoryController.getAllCategory);
router.get('/:categoryId/products', auth(Object.values(roles)), validation(validators.getProducts), categoryController.getProducts);

export default router;
