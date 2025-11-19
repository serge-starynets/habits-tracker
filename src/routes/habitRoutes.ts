import { Router } from 'express';
import {
  createHabit,
  getUserHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  // logHabitCompletion,
  completeHabit,
  // getHabitsByTag,
  // addTagsToHabit,
  // removeTagFromHabit,
} from '../controllers/habitController.ts';
import { authenticateToken } from '../middleware/auth.ts';
import { validateBody, validateParams } from '../middleware/validation.ts';
import { z } from 'zod';

const router = Router();

router.use(authenticateToken);

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly'], {
    message: 'Frequency must be daily, weekly, or monthly',
  }),
  targetCount: z.number().int().positive().optional().default(1),
  tagIds: z.array(z.string().uuid()).optional(),
});

const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetCount: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

const uuidSchema = z.object({
  id: z.string().uuid('Invalid habit ID format'),
});

router.get('/', getUserHabits);

router.get('/:id', validateParams(uuidSchema), getHabitById);

router.post('/', validateBody(createHabitSchema), createHabit);

router.put(
  '/:id',
  validateParams(uuidSchema),
  validateBody(updateHabitSchema),
  updateHabit
);

router.post(
  '/:id/complete',
  validateParams(uuidSchema),
  validateBody(z.object({ note: z.string().optional() })),
  completeHabit
);

router.delete('/:id', validateParams(uuidSchema), deleteHabit);

export default router;
