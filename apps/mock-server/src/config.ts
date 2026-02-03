import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  auth: {
    apiKey: process.env.API_KEY || 'ufo-tracker-2026',
  },
  
  simulation: {
    initialUfosCount: parseInt(process.env.INITIAL_UFOS_COUNT || '30', 10),
    maxUfosCount: parseInt(process.env.MAX_UFOS_COUNT || '200', 10),
    updateIntervalMs: parseInt(process.env.UPDATE_INTERVAL_MS || '10000', 10),
    spawnIntervalMs: parseInt(process.env.SPAWN_INTERVAL_MS || '20000', 10),
    despawnIntervalMs: parseInt(process.env.DESPAWN_INTERVAL_MS || '25000', 10),
  },
  
  bounds: {
    minLat: parseFloat(process.env.MIN_LAT || '44.38'),
    maxLat: parseFloat(process.env.MAX_LAT || '52.38'),
    minLng: parseFloat(process.env.MIN_LNG || '22.14'),
    maxLng: parseFloat(process.env.MAX_LNG || '40.23'),
  },
  
  physics: {
    minSpeedMps: parseFloat(process.env.MIN_SPEED_MPS || '20'),
    maxSpeedMps: parseFloat(process.env.MAX_SPEED_MPS || '60'),
    headingChangeMaxDeg: parseFloat(process.env.HEADING_CHANGE_MAX_DEG || '15'),
  },
} as const;
