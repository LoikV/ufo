export interface UfoUpdate {
  id: string;
  lat: number;
  lng: number;
  heading: number;
  ts: number;
}

export interface Ufo extends UfoUpdate {
  lastSeenAt: number;
  status: 'active' | 'lost';
}

export function isUfoUpdate(data: unknown): data is UfoUpdate {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  
  return (
    typeof d.id === 'string' &&
    d.id.length > 0 &&
    typeof d.lat === 'number' &&
    typeof d.lng === 'number' &&
    typeof d.heading === 'number' &&
    typeof d.ts === 'number'
  );
}
