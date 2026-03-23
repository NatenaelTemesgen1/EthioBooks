import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware, requireAdmin } from '../middlewares/auth';
import { validateBody } from '../middlewares/validate';
import { updateMeSchema } from '../utils/validators';
import { upload } from '../middlewares/upload'; // ✅ NEW

const router = Router();

router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, validateBody(updateMeSchema), userController.updateMe);

// ✅ NEW ROUTE (UPLOAD AVATAR)
router.post(
  '/me/avatar',
  authMiddleware,
  upload.single('avatar'),
  userController.uploadAvatar
);

router.get('/me/favorites', authMiddleware, userController.getMyFavorites);
router.get('/', authMiddleware, requireAdmin, userController.getUsers);
router.get('/:id', userController.getUserById);

export default router;