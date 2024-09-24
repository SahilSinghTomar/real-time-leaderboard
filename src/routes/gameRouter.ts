import express from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/db';
import redis from '../utils/redis';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

router.get('/bulk', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const games = await prisma.game.findMany();

    return res.status(200).json({
      success: 'All games fetched successfully',
      data: games,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/score/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { score } = req.body;

  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const game = await prisma.game.findUnique({
      where: {
        id,
      },
    });

    if (!game) {
      res.status(404).json({ error: 'Game not found' });
    }

    await prisma.score.create({
      data: {
        score,
        userId,
        gameId: id,
      },
    });

    const timestamp = Date.now();

    await redis.hset(
      `game:${id}:leaderboard`,
      user.username,
      `${score}:${timestamp}`
    );

    await redis.zadd(`overall:leaderboard`, score, user.username);

    res.status(201).json({
      success: 'Score added successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
