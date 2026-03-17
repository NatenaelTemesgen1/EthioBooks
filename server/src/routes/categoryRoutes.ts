import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { validateBody } from '../middlewares/validate';
import { authMiddleware, requireAdmin } from '../middlewares/auth';
import { createCategorySchema } from '../utils/validators';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/books', categoryController.getBooksByCategoryId);
router.post('/', authMiddleware, requireAdmin, validateBody(createCategorySchema), categoryController.createCategory);
router.put('/:id', authMiddleware, requireAdmin, validateBody(createCategorySchema.partial()), categoryController.updateCategory);
router.delete('/:id', authMiddleware, requireAdmin, categoryController.deleteCategory);

export default router;
