import type { Request, Response } from 'express';
import type { UfoSimulator } from '../services/UfoSimulator.js';

export class SSEController {
  constructor(private readonly simulator: UfoSimulator) {}

  streamUfos = (req: Request, res: Response): void => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    if (res.socket) {
      res.socket.setNoDelay(true);
      res.socket.setTimeout(0);
    }

    res.flushHeaders();

    const initialUfos = this.simulator.getActiveUfos();
    for (const ufo of initialUfos) {
      res.write(`data: ${JSON.stringify(ufo)}\n\n`);
    }

    const SIGNAL_DROP_CHANCE = 0.2;

    const interval = setInterval(() => {
      const ufos = this.simulator.getActiveUfos();
      const batchSize = 30 + Math.floor(Math.random() * 21);
      const shuffled = ufos.sort(() => Math.random() - 0.5);
      const batch = shuffled.slice(0, Math.min(batchSize, ufos.length));
      const toSend = batch.filter(() => Math.random() > SIGNAL_DROP_CHANCE);

      for (const ufo of toSend) {
        res.write(`data: ${JSON.stringify(ufo)}\n\n`);
      }
    }, 10000);

    req.on('close', () => clearInterval(interval));
  };
}
