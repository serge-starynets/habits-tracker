import { Router } from 'express';
import { z } from 'zod';

import { validateBody } from '../middleware/validation.ts';

const router = Router();

const createHabitSchema = z.object({
  name: z.string(),
});

router.get('/', (req, res) => {
  res.json({ habits: ['one', 'two'] });
});

router.get('/:id', (req, res) => {
  res.json({ habit: 'one' });
});

router.post('/', validateBody(createHabitSchema), (req, res) => {
  const { name: newHabit } = req.body;

  if (!newHabit) {
    res.json(null);
    return;
  }
  res.json({ habit: newHabit });
});

router.post('/:id/complete', (req, res) => {
  res.json({ message: 'habit completed' });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.status(204).json({ messsage: `habit with id ${id} deleted` });
});

export default router;
