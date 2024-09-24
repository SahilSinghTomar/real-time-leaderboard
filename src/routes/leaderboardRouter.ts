import express, { Request, Response } from 'express';
import redis from '../utils/redis';
import prisma from '../utils/db';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router = express.Router();

// Helper function to format leaderboard data
const formatLeaderboard = (topUsers: String[]) => {
  const leaderboard = [];
  for (let i = 0; i < topUsers.length; i += 2) {
    const [username, timestamp] = topUsers[i].split(':');

    leaderboard.push({
      username,
      timestamp: new Date(Number(timestamp)).toISOString(),
      score: Number(topUsers[i + 1]),
    });
  }
  return leaderboard;
};

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    // Fetch top players without date filtering
    const topUsers = await redis.zrevrange(
      `game:${id}:leaderboard`,
      start,
      end,
      'WITHSCORES'
    );

    const totalMembers = await redis.zcard(`game:${id}:leaderboard`);
    const totalPages = Math.ceil(totalMembers / limit);

    return res.status(200).json({
      success: 'Leaderboard fetched successfully',
      data: {
        currentPage: page,
        totalPages,
        totalItems: totalMembers,
        leaderboard: formatLeaderboard(topUsers),
      },
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return res.status(500).json({
      error: 'Internal Server Error. Could not fetch leaderboard.',
    });
  }
});

router.get('/:id/rank', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const redisKey = `game:${id}:leaderboard`;

    const rank = await redis.zrevrank(redisKey, user.username);

    if (!rank) {
      return res.status(404).json({ error: 'User not found in leaderboard' });
    }

    const userScore = await redis.zscore(redisKey, user.username);

    return res.status(200).json({
      success: 'User rank fetched successfully',
      data: {
        username: user.username,
        rank: rank + 1,
        score: userScore,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
