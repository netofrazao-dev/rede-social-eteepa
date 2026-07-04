import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(authenticate), asyncHandler(me));

export default router;
