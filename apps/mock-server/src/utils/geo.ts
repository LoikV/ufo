import type { Point, Bounds } from '../types.js';

const EARTH_RADIUS_M = 6371000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function destinationPoint(
  from: Point,
  bearingDeg: number,
  distanceMeters: number
): Point {
  const δ = distanceMeters / EARTH_RADIUS_M;
  const θ = toRad(bearingDeg);
  const φ1 = toRad(from.lat);
  const λ1 = toRad(from.lng);

  const sinφ1 = Math.sin(φ1);
  const cosφ1 = Math.cos(φ1);
  const sinδ = Math.sin(δ);
  const cosδ = Math.cos(δ);

  const sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);

  const y = Math.sin(θ) * sinδ * cosφ1;
  const x = cosδ - sinφ1 * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  return {
    lat: toDeg(φ2),
    lng: ((toDeg(λ2) + 540) % 360) - 180,
  };
}

export function isInBounds(point: Point, bounds: Bounds): boolean {
  return (
    point.lat >= bounds.minLat &&
    point.lat <= bounds.maxLat &&
    point.lng >= bounds.minLng &&
    point.lng <= bounds.maxLng
  );
}

export function normalizeHeading(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function randomPointInBounds(bounds: Bounds): Point {
  return {
    lat: bounds.minLat + Math.random() * (bounds.maxLat - bounds.minLat),
    lng: bounds.minLng + Math.random() * (bounds.maxLng - bounds.minLng),
  };
}

export function randomHeading(): number {
  return Math.random() * 360;
}
