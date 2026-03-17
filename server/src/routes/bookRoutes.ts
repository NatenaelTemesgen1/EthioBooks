import { Router } from 'express';
import * as bookController from '../controllers/bookController';
import * as reviewController from '../controllers/reviewController';
import { validateBody, validateQuery } from '../middlewares/validate';
import { authMiddleware, requireAdmin } from '../middlewares/auth';
import { createBookSchema, updateBookSchema, booksQuerySchema } from '../utils/validators';

const router = Router();

router.get('/popular', bookController.getPopularBooks);
router.get('/', validateQuery(booksQuerySchema), bookController.getBooks);
router.get('/:id/favorite', authMiddleware, bookController.getFavoriteStatus);
router.post('/:id/favorite', authMiddleware, bookController.addFavorite);
router.delete('/:id/favorite', authMiddleware, bookController.removeFavorite);
router.get('/:id/reviews', reviewController.getReviewsByBookId);
router.get('/:id', bookController.getBookById);

router.post('/', authMiddleware, requireAdmin, validateBody(createBookSchema), bookController.createBook);
router.put('/:id', authMiddleware, requireAdmin, validateBody(updateBookSchema), bookController.updateBook);
router.delete('/:id', authMiddleware, requireAdmin, bookController.deleteBook);

export default router;
