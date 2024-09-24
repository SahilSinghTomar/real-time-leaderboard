import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const protectedRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, 'PRANJUL') as { id: string };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    req.userId = user.id;
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  next();
};

export default protectedRoute;
