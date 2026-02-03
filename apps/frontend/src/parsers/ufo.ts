import type { UfoUpdate } from '../types/ufo';

export function parseUfoUpdate(data: unknown): UfoUpdate | null {
  const d = data as Partial<UfoUpdate>;
  
  const id = String(d.id || '');
  const lat = Number(d.lat);
  const lng = Number(d.lng);
  const heading = Number(d.heading);
  const ts = Number(d.ts);
  
  if (!id || isNaN(lat) || isNaN(lng) || isNaN(heading) || isNaN(ts)) {
    return null;
  }
  
  return { id, lat, lng, heading, ts };
}
