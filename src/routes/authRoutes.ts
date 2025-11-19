import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.ts';
import { register, login } from '../controllers/authController.ts';
import { insertUserSchema } from '../db/schema.ts';

const router = Router();

// Login validation schema
const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', validateBody(insertUserSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.post('/logout', (req, res) => {
  res.json({ message: 'User logged out' });
});

export default router;
