import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { generateToken } from '../utils/jwt.ts';
import { hashPassword, comparePassword } from '../utils/passwords.ts';
import { db } from '../db/connection.ts';
import { users } from '../db/schema.ts';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Hash password with configurable rounds
    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      });

    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      token, // User is logged in immediately
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
