export interface Ufo {
  id: string;
  lat: number;
  lng: number;
  heading: number;
  speedMps: number;
  lastUpdateTs: number;
  isActive: boolean;
}

export interface UfoUpdate {
  id: string;
  lat: number;
  lng: number;
  heading: number;
  ts: number;
}

export interface Point {
  lat: number;
  lng: number;
}

export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
