import { v4 as uuidv4 } from 'uuid';
import type { Ufo, UfoUpdate, Bounds } from '../types.js';
import {
  destinationPoint,
  isInBounds,
  normalizeHeading,
  randomPointInBounds,
  randomHeading,
} from '../utils/geo.js';

interface SimulatorConfig {
  initialCount: number;
  maxCount: number;
  updateIntervalMs: number;
  spawnIntervalMs: number;
  despawnIntervalMs: number;
  bounds: Bounds;
  minSpeedMps: number;
  maxSpeedMps: number;
  headingChangeMaxDeg: number;
}

export class UfoSimulator {
  private ufos = new Map<string, Ufo>();
  private updateTimer?: NodeJS.Timeout;
  private spawnTimer?: NodeJS.Timeout;
  private despawnTimer?: NodeJS.Timeout;

  constructor(private readonly config: SimulatorConfig) {}

  start(): void {
    this.spawnInitialUfos();

    this.updateTimer = setInterval(() => {
      this.updateAllUfos();
    }, this.config.updateIntervalMs);

    this.spawnTimer = setInterval(() => {
      this.spawnNewUfos();
    }, this.config.spawnIntervalMs);

    this.despawnTimer = setInterval(() => {
      this.despawnRandomUfos();
    }, this.config.despawnIntervalMs);
  }

  stop(): void {
    clearInterval(this.updateTimer);
    clearInterval(this.spawnTimer);
    clearInterval(this.despawnTimer);
  }

  getActiveUfos(): UfoUpdate[] {
    const active: UfoUpdate[] = [];

    for (const ufo of this.ufos.values()) {
      if (ufo.isActive) {
        active.push({
          id: ufo.id,
          lat: parseFloat(ufo.lat.toFixed(6)),
          lng: parseFloat(ufo.lng.toFixed(6)),
          heading: parseFloat(ufo.heading.toFixed(1)),
          ts: ufo.lastUpdateTs,
        });
      }
    }

    return active;
  }

  private spawnInitialUfos(): void {
    for (let i = 0; i < this.config.initialCount; i++) {
      this.createUfo();
    }
  }

  private createUfo(): Ufo {
    const id = `ufo-${uuidv4().slice(0, 8)}`;
    const position = randomPointInBounds(this.config.bounds);
    const heading = randomHeading();
    const speedMps =
      this.config.minSpeedMps +
      Math.random() * (this.config.maxSpeedMps - this.config.minSpeedMps);

    const ufo: Ufo = {
      id,
      lat: position.lat,
      lng: position.lng,
      heading,
      speedMps,
      lastUpdateTs: Date.now(),
      isActive: true,
    };

    this.ufos.set(id, ufo);
    return ufo;
  }

  private updateAllUfos(): void {
    const now = Date.now();
    const deltaSeconds = this.config.updateIntervalMs / 1000;

    for (const ufo of this.ufos.values()) {
      if (!ufo.isActive) continue;

      const headingChange =
        (Math.random() - 0.5) * 2 * this.config.headingChangeMaxDeg;
      ufo.heading = normalizeHeading(ufo.heading + headingChange);

      const distanceMeters = ufo.speedMps * deltaSeconds;
      let newPosition = destinationPoint(
        { lat: ufo.lat, lng: ufo.lng },
        ufo.heading,
        distanceMeters
      );

      if (!isInBounds(newPosition, this.config.bounds)) {
        ufo.heading = normalizeHeading(ufo.heading + 180);
        newPosition = destinationPoint(
          { lat: ufo.lat, lng: ufo.lng },
          ufo.heading,
          distanceMeters
        );
      }

      ufo.lat = newPosition.lat;
      ufo.lng = newPosition.lng;
      ufo.lastUpdateTs = now;
    }
  }

  private spawnNewUfos(): void {
    const currentCount = this.ufos.size;

    if (currentCount >= this.config.maxCount) {
      return;
    }

    const spawnCount = Math.min(
      2 + Math.floor(Math.random() * 4),
      this.config.maxCount - currentCount
    );

    for (let i = 0; i < spawnCount; i++) {
      this.createUfo();
    }
  }

  private despawnRandomUfos(): void {
    const activeUfos = Array.from(this.ufos.values()).filter(
      (u) => u.isActive
    );

    if (activeUfos.length === 0) return;

    const despawnCount = Math.min(
      2 + Math.floor(Math.random() * 5),
      activeUfos.length
    );

    for (let i = 0; i < despawnCount; i++) {
      const randomIndex = Math.floor(Math.random() * activeUfos.length);
      const ufo = activeUfos.splice(randomIndex, 1)[0];

      if (ufo) {
        ufo.isActive = false;
      }
    }
  }
}
