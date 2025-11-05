import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/user.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = Router();
router.use(protect, isAdmin);
router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);

export default router;