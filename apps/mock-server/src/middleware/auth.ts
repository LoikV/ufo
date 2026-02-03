import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-api-key'] || req.query.key;

  if (!apiKey) {
    res.status(401).json({ error: 'Missing API key' });
    return;
  }

  if (apiKey !== config.auth.apiKey) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  next();
}
