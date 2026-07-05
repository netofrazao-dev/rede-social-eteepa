import { Router } from 'express';
import { login, register, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/login', asyncHandler(login));
router.post('/register', asyncHandler(register));
router.get('/me', asyncHandler(authenticate), asyncHandler(me));

export default router;
