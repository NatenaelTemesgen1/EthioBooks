import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { validateBody } from '../middlewares/validate';
import { authMiddleware, requireAdmin } from '../middlewares/auth';
import { createReviewSchema, updateReviewSchema } from '../utils/validators';

const router = Router();

router.get('/latest', reviewController.getLatestReviews);
router.get('/', authMiddleware, requireAdmin, reviewController.getReviews);
router.post('/', authMiddleware, validateBody(createReviewSchema), reviewController.createReview);
router.put('/:id', authMiddleware, validateBody(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

export default router;
