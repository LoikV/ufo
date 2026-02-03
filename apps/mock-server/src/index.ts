import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { UfoSimulator } from './services/UfoSimulator.js';
import { SSEController } from './controllers/sseController.js';
import { loginController } from './controllers/authController.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

const simulator = new UfoSimulator({
  initialCount: config.simulation.initialUfosCount,
  maxCount: config.simulation.maxUfosCount,
  updateIntervalMs: config.simulation.updateIntervalMs,
  spawnIntervalMs: config.simulation.spawnIntervalMs,
  despawnIntervalMs: config.simulation.despawnIntervalMs,
  bounds: config.bounds,
  minSpeedMps: config.physics.minSpeedMps,
  maxSpeedMps: config.physics.maxSpeedMps,
  headingChangeMaxDeg: config.physics.headingChangeMaxDeg,
});

const sseController = new SSEController(simulator);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/auth/login', loginController);

app.get('/api/ufos/stream', authMiddleware, sseController.streamUfos);

const server = app.listen(config.port, () => {
  simulator.start();
});

const shutdown = () => {
  simulator.stop();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
