import type { Request, Response } from 'express';
import { config } from '../config.js';

const LOGIN_DELAY_MS = 600;

export function loginController(req: Request, res: Response): void {
  const { apiKey } = req.body;

  if (!apiKey) {
    res.status(400).json({ error: 'Missing API key' });
    return;
  }

  if (apiKey !== config.auth.apiKey) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  setTimeout(() => {
    res.json({
      success: true,
      apiKey: apiKey,
    });
  }, LOGIN_DELAY_MS);
}
