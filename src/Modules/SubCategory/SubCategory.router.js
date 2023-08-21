import { Router } from 'express';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import * as subCategoryController from './controller/SubCategory.controller.js';
import * as validators from './SubCategory.validation.js';
import validation from '../../Middleware/validation.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import { endPoint } from './SubCategory.endPoints.js';
const router = Router({ mergeParams: true });

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), validation(validators.createSubCategory), subCategoryController.createSubCategory);
router.put('/update/:subCategoryId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'), validation(validators.updateSubCategory), subCategoryController.updateSubCategory);
router.get('/', auth(Object.values(roles)), validation(validators.getSubCategory), subCategoryController.getSubCategory);
router.get('/all', auth(Object.values(roles)), subCategoryController.getAllSubCategory);
router.get('/:subCategoryId/products', auth(Object.values(roles)), validation(validators.getProducts), subCategoryController.getProducts);
export default router;
