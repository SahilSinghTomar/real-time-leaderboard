import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter';
import leaderboardRouter from './routes/leaderboardRouter';
import gameRouter from './routes/gameRouter';
import authMiddleware from './routes/authMiddleware';
import cookieParser from 'cookie-parser';
import redis from './utils/redis';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (_, res) => {
  res.send('Real-time Leaderboard!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/games', authMiddleware, gameRouter);
app.use('/api/v1/leaderboard', authMiddleware, leaderboardRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
