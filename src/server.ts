import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes.ts';
import habitRoutes from './routes/habitRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import tagRoutes from './routes/tagRoutes.ts';
import { isTestEnv } from '../env.ts';
import { errorHandler, notFound } from './middleware/errorHandler.ts';

const app = express();

app.use(helmet());
app.use(cors());
app.use(
  morgan('dev', {
    skip: () => isTestEnv(),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Habit Tracker API',
  });
});

app.use('/api/auth', authRoutes); // All auth routes prefixed with /api/auth
app.use('/api/users', userRoutes); // All user routes prefixed with /api/users
app.use('/api/habits', habitRoutes);
app.use('/api/tags', tagRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
