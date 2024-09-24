import express from 'express';
import prisma from '../utils/db';
import { registerSchema, loginSchema } from '../schemas';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
  const body = req.body;

  const validatedFields = registerSchema.safeParse(body);

  if (!validatedFields.success) {
    return res.status(400).json({
      error: 'Invalid fields!',
    });
  }

  const { username, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Username already exists!',
      });
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: 'User created Successfully!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

router.post('/login', async (req, res) => {
  const body = req.body;

  const validatedFields = loginSchema.safeParse(body);

  if (!validatedFields.success) {
    return res.status(400).json({
      error: 'Invalid fields!',
    });
  }

  const { username, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found!',
      });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid credientials!',
      });
    }

    const token = jwt.sign({ id: user.id }, 'PRANJUL', {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      message: 'Login successful!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
