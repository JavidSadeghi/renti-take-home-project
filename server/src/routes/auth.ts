import express from 'express';
import { register, login } from '../controllers/authController';
import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware';

const router = express.Router();

// Routes with comprehensive validation
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

export default router;
