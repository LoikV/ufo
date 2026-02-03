export const LOST_THRESHOLD_MS = 45000;
export const REMOVE_THRESHOLD_MS = 120000;
export const CLEANUP_INTERVAL_MS = 10000;

export const MAP_CONFIG = {
  center: [49.0, 31.0] as [number, number],
  zoom: 6,
  bounds: {
    minLat: 44.38,
    maxLat: 52.38,
    minLng: 22.14,
    maxLng: 40.23,
  },
} as const;
